import { Mystery } from '../models/Mystery.js';
import { env } from '../config/env.js';
import { generateMystery, getAiModel, getAvailableAiProviders } from './geminiService.js';
import { createPredefinedMystery } from './predefinedMysteryService.js';
import { validateCase } from './solvabilityService.js';

let activeGenerations = 0;

export function canStartGeneration() {
  return activeGenerations < env.MAX_ACTIVE_GENERATIONS;
}

export function reserveGeneration() {
  if (!canStartGeneration()) return false;
  activeGenerations += 1;
  return true;
}

export function releaseGeneration() {
  activeGenerations = Math.max(0, activeGenerations - 1);
}

async function savePlayableCase(mystery, generated, validation, provider) {
  mystery.title = generated.title;
  mystery.summary = generated.summary;
  mystery.setting = generated.setting;
  mystery.suspects = generated.suspects;
  mystery.events = generated.events;
  mystery.evidence = generated.evidence;
  mystery.solution = { ...generated.solution, solvabilityScore: validation.solvabilityScore };
  mystery.generationProvider = provider;
  mystery.generationModel = provider === 'predefined' ? 'clocktower-ledger-v1' : getAiModel(provider);
  mystery.status = 'READY';
  mystery.failureMessage = undefined;
  await mystery.save();
  console.log(`Mystery ${mystery._id} ready; provider=${provider}.`);
}

export async function runGeneration(id) {
  try {
    const mystery = await Mystery.findById(id);
    if (!mystery) return;

    const input = {
      scenario: mystery.scenario,
      category: mystery.category,
      difficulty: mystery.difficulty,
      preferences: { setting: mystery.setting, evidenceTypes: mystery.evidencePreferences }
    };
    const providers = getAvailableAiProviders();
    let lastIssues = [];
    let completed = false;

    // Try each configured AI provider. A provider API failure moves immediately
    // to the next provider; validation failures get a small bounded repair loop.
    for (const provider of providers) {
      for (let attempt = 0; attempt <= env.AI_MAX_RETRIES; attempt += 1) {
        mystery.generationAttempts = (mystery.generationAttempts || 0) + 1;
        mystery.status = 'GENERATING';
        await mystery.save();

        let generated;
        try {
          generated = await generateMystery(input, lastIssues.join('\n'), provider);
        } catch (error) {
          console.warn(`${provider} provider failed; moving to next fallback.`, error.message);
          break;
        }

        mystery.status = 'VALIDATING';
        await mystery.save();
        const validation = validateCase(generated, mystery.difficulty);
        if (validation.valid) {
          await savePlayableCase(mystery, generated, validation, provider);
          completed = true;
          break;
        }

        lastIssues = validation.issues;
        console.warn(`${provider} generated a case that failed validation:`, lastIssues);
      }
      if (completed) return;
    }

    // Final resilience layer: a curated, deterministic case. It is validated
    // by the same rules as AI-generated cases before it can become playable.
    mystery.status = 'GENERATING';
    await mystery.save();
    const backup = createPredefinedMystery(input);
    const backupValidation = validateCase(backup, mystery.difficulty);
    if (backupValidation.valid) {
      await savePlayableCase(mystery, backup, backupValidation, 'predefined');
      return;
    }

    console.error('Predefined backup failed validation:', backupValidation.issues);
    mystery.status = 'FAILED';
    mystery.failureMessage = 'We could not prepare a playable case. Please try again.';
    await mystery.save();
  } catch (error) {
    console.error('Mystery generation failed:', error.message);
    await Mystery.findByIdAndUpdate(id, {
      status: 'FAILED',
      failureMessage: 'Your mystery could not be generated right now. Please try again.'
    }).catch(() => {});
  } finally {
    releaseGeneration();
  }
}
