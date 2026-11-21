
import { Mystery } from '../models/Mystery.js';
import { env } from '../config/env.js';
import { generateMystery } from './geminiService.js';
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

export async function runGeneration(id) {
  try {
    const mystery = await Mystery.findById(id);

    if (!mystery) return;

    let lastIssues = [];

    // Retry only when the generated mystery fails validation.
    for (
      let attempt = 0;
      attempt <= env.AI_MAX_RETRIES;
      attempt += 1
    ) {
      mystery.generationAttempts = attempt + 1;
      mystery.status = 'GENERATING';

      await mystery.save();

      let generated;

      try {
        generated = await generateMystery(
          {
            scenario: mystery.scenario,
            category: mystery.category,
            difficulty: mystery.difficulty,
            preferences: {
              setting: mystery.setting,
              evidenceTypes: mystery.evidencePreferences
            }
          },
          lastIssues.join('\n')
        );
      } catch (error) {
        // Do not retry the entire generation for Gemini/API failures.
        console.error(
          `AI generation failed on attempt ${attempt + 1}:`,
          error.message
        );

        throw error;
      }

      mystery.status = 'VALIDATING';
      await mystery.save();

      const validation = validateCase(
        generated,
        mystery.difficulty
      );

      if (validation.valid) {
        mystery.title = generated.title;
        mystery.summary = generated.summary;
        mystery.setting = generated.setting;
        mystery.suspects = generated.suspects;
        mystery.events = generated.events;
        mystery.evidence = generated.evidence;

        mystery.solution = {
          ...generated.solution,
          solvabilityScore: validation.solvabilityScore
        };

        mystery.status = 'READY';
        mystery.failureMessage = undefined;

        await mystery.save();

        console.log(`Mystery ${id} generated successfully.`);

        return;
      }

      // Save validation issues for the next repair attempt.
      lastIssues = validation.issues;

      console.warn(
        `Mystery validation failed on attempt ${attempt + 1}:`,
        lastIssues
      );
    }

    // All validation attempts were unsuccessful.
    mystery.status = 'FAILED';

    mystery.failureMessage =
      'The case could not pass the consistency checks. Please retry with a different scenario.';

    await mystery.save();

  } catch (error) {
    console.error(
      'Mystery generation failed:',
      error.message
    );

    await Mystery.findByIdAndUpdate(id, {
      status: 'FAILED',
      failureMessage:
        'Your mystery could not be generated right now. Please try again.'
    }).catch(() => {});

  } finally {
    // Always release the generation slot.
    releaseGeneration();
  }
}
