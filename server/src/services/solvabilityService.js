import { difficultyCounts } from '../validators/mystery.js';
import { generatedCaseSchema } from '../validators/mystery.js';

export function validateCase(candidate, difficulty) {
  const issues = [];
  const shape = generatedCaseSchema.safeParse(candidate);
  if (!shape.success) issues.push(...shape.error.issues.slice(0, 12).map((issue) => `${issue.path.join('.') || 'case'}: ${issue.message}`));
  const target = difficultyCounts[difficulty];
  if (!candidate || !target) return { valid: false, issues: ['Unknown case difficulty or missing case.'] };
  if ((candidate.suspects || []).length !== target.suspects) issues.push(`Expected ${target.suspects} suspects.`);
  if ((candidate.evidence || []).length < target.evidenceMin || (candidate.evidence || []).length > target.evidenceMax) issues.push(`Expected ${target.evidenceMin}-${target.evidenceMax} evidence items.`);
  if ((candidate.events || []).length < 4) issues.push('The case timeline needs at least four events.');
  const unique = (items, key, label) => { const values = (items || []).map((item) => item[key]); if (values.some((v) => !v) || new Set(values).size !== values.length) issues.push(`${label} IDs must be present and unique.`); };
  unique(candidate.suspects, 'suspectId', 'Suspect'); unique(candidate.events, 'eventId', 'Event'); unique(candidate.evidence, 'evidenceId', 'Evidence');
  const suspectIds = new Set((candidate.suspects || []).map((item) => item.suspectId));
  const eventIds = new Set((candidate.events || []).map((item) => item.eventId));
  const evidenceIds = new Set((candidate.evidence || []).map((item) => item.evidenceId));
  if (!suspectIds.has(candidate.solution?.culpritSuspectId)) issues.push('The culprit must be a listed suspect.');
  for (const item of candidate.events || []) {
    if ((item.suspectIds || []).some((id) => !suspectIds.has(id))) issues.push(`Event ${item.eventId} refers to an unknown suspect.`);
    if ((item.evidenceIds || []).some((id) => !evidenceIds.has(id))) issues.push(`Event ${item.eventId} refers to unknown evidence.`);
  }
  for (const item of candidate.evidence || []) {
    if ((item.suspectIds || []).some((id) => !suspectIds.has(id))) issues.push(`Evidence ${item.evidenceId} refers to an unknown suspect.`);
    if ((item.eventIds || []).some((id) => !eventIds.has(id))) issues.push(`Evidence ${item.evidenceId} refers to an unknown event.`);
    for (const eventId of item.eventIds || []) {
      const event = (candidate.events || []).find((entry) => entry.eventId === eventId);
      if (event && !(event.evidenceIds || []).includes(item.evidenceId)) issues.push(`Evidence ${item.evidenceId} is missing from its event's evidence references.`);
    }
    if (item.media?.url) issues.push('Model-generated media URLs are not accepted.');
  }
  for (const item of candidate.events || []) for (const evidenceId of item.evidenceIds || []) {
    const evidence = (candidate.evidence || []).find((entry) => entry.evidenceId === evidenceId);
    if (evidence && !(evidence.eventIds || []).includes(item.eventId)) issues.push(`Event ${item.eventId} has a one-sided evidence reference.`);
  }
  const decisive = candidate.solution?.decisiveEvidenceIds || [];
  if (decisive.length < 2) issues.push('At least two decisive clues are required.');
  if (decisive.some((id) => !evidenceIds.has(id))) issues.push('Decisive clues must reference existing evidence.');
  const primary = (candidate.evidence || []).filter((item) => item.clueRole === 'PRIMARY_CLUE').map((item) => item.evidenceId);
  if (decisive.some((id) => !primary.includes(id))) issues.push('Every decisive clue must be marked as a primary clue.');
  const decisiveSources = new Set((candidate.evidence || []).filter((item) => decisive.includes(item.evidenceId)).map((item) => item.source?.trim()).filter(Boolean));
  if (decisiveSources.size < 2) issues.push('Decisive clues must come from at least two independent sources.');
  const innocent = (candidate.suspects || []).filter((item) => item.suspectId !== candidate.solution?.culpritSuspectId);
  const exclusions = new Map((candidate.solution?.suspectExclusions || []).map((item) => [item.suspectId, item.reason]));
  if (innocent.some((item) => !exclusions.get(item.suspectId)?.trim())) issues.push('Every innocent suspect needs an exclusion explanation.');
  if (!candidate.solution?.motive?.trim() || !candidate.solution?.method?.trim() || !candidate.solution?.opportunity?.trim()) issues.push('The solution must establish motive, method, and opportunity.');
  const times = (candidate.events || []).map((item) => new Date(item.timestamp).getTime());
  if (times.some((value) => !Number.isFinite(value))) issues.push('Every event needs a valid timestamp.');
  const ordered = [...(candidate.events || [])].sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
  if ((candidate.events || []).some((item, index) => item !== ordered[index])) issues.push('Events must be in chronological order.');
  const solvabilityScore = Math.min(100, decisive.length * 18 + Math.min(3, primary.length) * 12 + Math.min(5, exclusions.size) * 5 + (issues.length === 0 ? 15 : 0));
  return { valid: issues.length === 0, issues: [...new Set(issues)], solvabilityScore };
}

export function publicMystery(doc) {
  const item = doc.toObject ? doc.toObject() : doc;
  return { id: String(item._id), title: item.title, scenario: item.scenario, category: item.category, difficulty: item.difficulty, summary: item.summary, setting: item.setting, status: item.status, createdAt: item.createdAt, suspects: publicSuspects(item.suspects), events: item.events, evidence: publicEvidence(item.evidence), accusationSubmitted: Boolean(item.accusation?.submitted) };
}
export function publicSuspects(suspects) { return suspects.map((value) => { const suspect = value.toObject ? value.toObject() : value; const { secret, ...safe } = suspect; return safe; }); }
export function publicEvidence(evidence) { return evidence.map((value) => { const item = value.toObject ? value.toObject() : value; const { clueRole, ...safe } = item; return safe; }); }
