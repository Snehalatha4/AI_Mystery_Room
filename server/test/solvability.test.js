import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCase, publicMystery, publicSuspects } from '../src/services/solvabilityService.js';
import { createMysterySchema } from '../src/validators/mystery.js';
import { evaluateAccusation } from '../src/services/accusationService.js';
import { parseStructuredJson } from '../src/services/geminiService.js';

function fixture() {
  const suspects = [1,2,3].map((n) => ({ suspectId: `s${n}`, name: `Suspect ${n}`, age: '35', role: 'Guest', relationship: 'Attended the gathering', motive: 'A distinct financial motive was at stake.', alibi: 'They claim to have been in the dining room.', suspiciousBehavior: 'They avoided answering one question.', publicFacts: ['They attended the gathering.'], secret: `secret ${n}` }));
  const events = [1,2,3,4].map((n) => ({ eventId: `e${n}`, timestamp: new Date(`2026-01-01T${String(9+n).padStart(2,'0')}:00:00Z`), description: n === 1 ? 'The valuable object disappeared from the locked display case.' : `A witness records another important event at the gallery, number ${n}.`, location: 'Gallery', suspectIds: ['s1'], evidenceIds: n === 1 ? ['clue1','clue2','clue3','clue4','clue5','clue6'] : [] }));
  const evidence = ['clue1','clue2','clue3','clue4','clue5','clue6'].map((evidenceId) => ({ evidenceId, type: 'DOCUMENT', title: `Record ${evidenceId}`, summary: 'A record establishes what happened at the gallery.', content: 'The detailed record contains a timestamp and verified access information.', source: evidenceId === 'clue1' ? 'Gallery access log' : evidenceId === 'clue2' ? 'Independent witness statement' : 'Additional archive records', suspectIds: ['s1'], eventIds: ['e1'], reliability: 'High; original record', clueRole: evidenceId === 'clue1' || evidenceId === 'clue2' ? 'PRIMARY_CLUE' : 'SUPPORTING_CLUE' }));
  return { title: 'The Gallery Case', summary: 'A valuable object vanished from a locked gallery during a private gathering.', setting: 'A private gallery', suspects, events, evidence, solution: { culpritSuspectId: 's1', motive: 'The culprit needed to settle an urgent debt.', method: 'They used their access key to open the locked case.', opportunity: 'The timeline leaves them alone in the gallery.', timelineExplanation: 'The access event and the witness timestamp place the culprit in the gallery at the right time.', reasoningSummary: 'Two independent records establish who had both access and opportunity.', decisiveEvidenceIds: ['clue1','clue2'], suspectExclusions: [{ suspectId: 's2', reason: 'The access log shows their key remained at the entrance.' }, { suspectId: 's3', reason: 'A witness places them in another room.' }] } };
}

test('accepts a complete, linked, uniquely solvable easy case', () => {
  const result = validateCase(fixture(), 'EASY');
  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.ok(result.solvabilityScore >= 0);
});
test('rejects unknown references and missing innocent suspect exclusions', () => {
  const value = fixture(); value.evidence[0].eventIds = ['missing']; value.solution.suspectExclusions = [];
  const result = validateCase(value, 'EASY');
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.includes('unknown event')));
  assert.ok(result.issues.some((issue) => issue.includes('exclusion')));
});
test('public case and suspect serializers remove solution secrets', () => {
  const doc = { _id: 'case1', title: 'A case', scenario: 'fiction', category: 'THEFT', difficulty: 'EASY', summary: 'summary', status: 'READY', suspects: [{ suspectId: 's1', name: 'A', secret: 'private' }], events: [], evidence: [{ evidenceId: 'clue1', clueRole: 'PRIMARY_CLUE', title: 'A record' }], solution: { culpritSuspectId: 's1' }, accusation: { submitted: false }, toObject() { return this; } };
  const result = publicMystery(doc);
  assert.equal('solution' in result, false);
  assert.equal('secret' in result.suspects[0], false);
  assert.equal('clueRole' in result.evidence[0], false);
  assert.equal('secret' in publicSuspects(doc.suspects)[0], false);
});
test('scenario input requires 30-2000 characters', () => {
  assert.equal(createMysterySchema.safeParse({ scenario: 'too short' }).success, false);
  assert.equal(createMysterySchema.safeParse({ scenario: 'A'.repeat(30) }).success, true);
  assert.equal(createMysterySchema.safeParse({ scenario: 'A'.repeat(2001) }).success, false);
});
test('accusation evaluation compares only the stored culprit ID', () => {
  assert.equal(evaluateAccusation('s1', 's1'), true);
  assert.equal(evaluateAccusation('s2', 's1'), false);
  assert.equal(evaluateAccusation(undefined, 's1'), false);
});
test('structured Gemini response parsing rejects prose and malformed JSON', () => {
  assert.deepEqual(parseStructuredJson('{"case":"ready"}'), { case: 'ready' });
  assert.throws(() => parseStructuredJson('Here is the JSON: {}'), /malformed structured data/);
  assert.throws(() => parseStructuredJson(''), /empty response/);
});
