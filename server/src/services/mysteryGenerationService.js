import { Mystery } from '../models/Mystery.js';
import { env } from '../config/env.js';
import { generateMystery } from './geminiService.js';
import { validateCase } from './solvabilityService.js';

let activeGenerations = 0;
export function canStartGeneration() { return activeGenerations < env.MAX_ACTIVE_GENERATIONS; }
export function reserveGeneration() { if (!canStartGeneration()) return false; activeGenerations += 1; return true; }
export function releaseGeneration() { activeGenerations = Math.max(0, activeGenerations - 1); }

export async function runGeneration(id) {
  try {
    const mystery = await Mystery.findById(id);
    if (!mystery) return;
    let lastIssues = [];
    for (let attempt = 0; attempt <= env.AI_MAX_RETRIES; attempt += 1) {
      mystery.generationAttempts = attempt + 1;
      mystery.status = attempt ? 'VALIDATING' : 'GENERATING';
      await mystery.save();
      try {
        const generated = await generateMystery({ scenario: mystery.scenario, category: mystery.category, difficulty: mystery.difficulty, preferences: { setting: mystery.setting, evidenceTypes: mystery.evidencePreferences } }, lastIssues.join('\n'));
        mystery.status = 'VALIDATING';
        await mystery.save();
        const validation = validateCase(generated, mystery.difficulty);
        if (validation.valid) {
          mystery.title = generated.title;
          mystery.summary = generated.summary;
          mystery.setting = generated.setting;
          mystery.suspects = generated.suspects;
          mystery.events = generated.events;
          mystery.evidence = generated.evidence;
          mystery.solution = { ...generated.solution, solvabilityScore: validation.solvabilityScore };
          mystery.status = 'READY';
          mystery.failureMessage = undefined;
          await mystery.save();
          return;
        }
        lastIssues = validation.issues;
      } catch (error) {
        lastIssues = [`Generation attempt ${attempt + 1} failed: ${error.message}`];
        if (attempt === env.AI_MAX_RETRIES) throw error;
      }
    }
    mystery.status = 'FAILED';
    mystery.failureMessage = 'The case could not pass the consistency checks. Please retry with a different scenario.';
    await mystery.save();
  } catch (error) {
    console.error('Mystery generation failed:', error.message);
    await Mystery.findByIdAndUpdate(id, { status: 'FAILED', failureMessage: 'Your mystery could not be generated right now. Please try again.' }).catch(() => {});
  } finally {
    releaseGeneration();
  }
}
