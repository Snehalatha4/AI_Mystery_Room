import mongoose from 'mongoose';
import { Mystery } from '../models/Mystery.js';
import { env } from '../config/env.js';
import { createMysterySchema, accusationSchema } from '../validators/mystery.js';
import { reserveGeneration, releaseGeneration, runGeneration } from '../services/mysteryGenerationService.js';
import { publicMystery, publicSuspects, publicEvidence } from '../services/solvabilityService.js';
import { evaluateAccusation } from '../services/accusationService.js';
import { HttpError } from '../middleware/errors.js';

const send = (res, data, status = 200) => res.status(status).json({ success: true, data });
const caseById = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'This case file does not exist.', 'CASE_NOT_FOUND');
  const record = await Mystery.findById(id).select('+solution +resultExplanation');
  if (!record) throw new HttpError(404, 'This case file does not exist.', 'CASE_NOT_FOUND');
  return record;
};

export async function create(req, res, next) {
  try {
    const parsed = createMysterySchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message || 'Please check the scenario and try again.', 'VALIDATION_ERROR');
    if (!reserveGeneration()) throw new HttpError(503, 'The investigation room is at capacity. Please try again shortly.', 'GENERATION_CAPACITY');
    const input = parsed.data;
    let mystery;
    try { mystery = await Mystery.create({ title: 'New investigation', scenario: input.scenario, category: input.category, difficulty: input.difficulty, summary: 'A new case is being prepared.', setting: input.preferences.setting, evidencePreferences: input.preferences.evidenceTypes, status: 'GENERATING' }); }
    catch (error) { releaseGeneration(); throw error; }
    setImmediate(() => runGeneration(mystery._id).catch((error) => console.error('Generation task error:', error.message)));
    return send(res, { id: String(mystery._id), title: mystery.title, status: mystery.status }, 201);
  } catch (error) { return next(error); }
}

export async function status(req, res, next) {
  try { const mystery = await caseById(req.params.id); return send(res, { id: String(mystery._id), status: mystery.status, message: mystery.status === 'FAILED' ? mystery.failureMessage : undefined }); }
  catch (error) { return next(error); }
}

export async function getMystery(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'READY') throw new HttpError(mystery.status === 'FAILED' ? 409 : 425, mystery.failureMessage || 'This case is not ready yet.', 'CASE_NOT_READY');
    return send(res, publicMystery(mystery));
  } catch (error) { return next(error); }
}

export async function getEvidence(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'READY') throw new HttpError(425, 'This case is not ready yet.', 'CASE_NOT_READY');
    const { type, suspectId, sort } = req.query;
    const allowedTypes = ['CHAT','IMAGE','CCTV','WITNESS_STATEMENT','PHYSICAL','DOCUMENT'];
    if (type && !allowedTypes.includes(type)) throw new HttpError(400, 'That evidence type is not supported.', 'VALIDATION_ERROR');
    if (sort && !['asc','desc'].includes(sort)) throw new HttpError(400, 'Sort must be asc or desc.', 'VALIDATION_ERROR');
    if (suspectId && !mystery.suspects.some((suspect) => suspect.suspectId === suspectId)) throw new HttpError(400, 'That suspect is not part of this case.', 'INVALID_SUSPECT');
    let items = mystery.evidence.filter((item) => (!type || item.type === type) && (!suspectId || item.suspectIds.includes(suspectId)));
    if (sort) items = [...items].sort((a,b) => (new Date(a.timestamp || 0) - new Date(b.timestamp || 0)) * (sort === 'desc' ? -1 : 1));
    return send(res, publicEvidence(items));
  } catch (error) { return next(error); }
}

export async function getEvidenceItem(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'READY') throw new HttpError(425, 'This case is not ready yet.', 'CASE_NOT_READY');
    const item = mystery.evidence.find((value) => value.evidenceId === req.params.evidenceId);
    if (!item) throw new HttpError(404, 'That evidence is not part of this case.', 'EVIDENCE_NOT_FOUND');
    return send(res, publicEvidence([item])[0]);
  } catch (error) { return next(error); }
}

export async function getSuspects(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'READY') throw new HttpError(425, 'This case is not ready yet.', 'CASE_NOT_READY');
    return send(res, publicSuspects(mystery.suspects));
  } catch (error) { return next(error); }
}

export async function getTimeline(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'READY') throw new HttpError(425, 'This case is not ready yet.', 'CASE_NOT_READY');
    return send(res, mystery.events.map(({ eventId, timestamp, endTimestamp, description, location, suspectIds, evidenceIds }) => ({ eventId, timestamp, endTimestamp, description, location, suspectIds, evidenceIds })));
  } catch (error) { return next(error); }
}

function reveal(mystery) {
  const culprit = mystery.suspects.find((item) => item.suspectId === mystery.solution.culpritSuspectId);
  const suspectExclusions = mystery.solution.suspectExclusions.map((entry) => ({ ...entry.toObject?.() || entry, name: mystery.suspects.find((suspect) => suspect.suspectId === entry.suspectId)?.name || 'Suspect' }));
  return { correct: mystery.accusation.correct, culprit: { suspectId: culprit.suspectId, name: culprit.name }, explanation: mystery.resultExplanation || mystery.solution.reasoningSummary, motive: mystery.solution.motive, method: mystery.solution.method, opportunity: mystery.solution.opportunity, timelineExplanation: mystery.solution.timelineExplanation, suspectExclusions, decisiveEvidenceIds: mystery.solution.decisiveEvidenceIds };
}

export async function accuse(req, res, next) {
  try {
    const parsed = accusationSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message || 'Please choose one suspect.', 'VALIDATION_ERROR');
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'READY') throw new HttpError(409, 'This case is not ready for an accusation.', 'CASE_NOT_READY');
    if (mystery.accusation?.submitted) throw new HttpError(409, 'An accusation has already been submitted for this case.', 'DUPLICATE_ACCUSATION');
    if (!mystery.suspects.some((item) => item.suspectId === parsed.data.suspectId)) throw new HttpError(400, 'Choose a suspect from this case.', 'INVALID_SUSPECT');
    const resultExplanation = `${mystery.solution.reasoningSummary}\n\nMotive: ${mystery.solution.motive}\nMethod: ${mystery.solution.method}\nOpportunity: ${mystery.solution.opportunity}\n\n${mystery.solution.timelineExplanation}`;
    const updated = await Mystery.findOneAndUpdate({ _id: mystery._id, status: 'READY', 'accusation.submitted': { $ne: true } }, { $set: { 'accusation.submitted': true, 'accusation.suspectId': parsed.data.suspectId, 'accusation.explanation': parsed.data.explanation, 'accusation.correct': evaluateAccusation(parsed.data.suspectId, mystery.solution.culpritSuspectId), 'accusation.submittedAt': new Date(), resultExplanation } }, { new: true }).select('+solution +resultExplanation');
    if (!updated) throw new HttpError(409, 'An accusation has already been submitted for this case.', 'DUPLICATE_ACCUSATION');
    return send(res, reveal(updated));
  } catch (error) { return next(error); }
}

export async function getResult(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (!mystery.accusation?.submitted || mystery.status !== 'READY') throw new HttpError(403, 'Submit an accusation to unlock this case reveal.', 'REVEAL_LOCKED');
    return send(res, reveal(mystery));
  } catch (error) { return next(error); }
}

export async function retry(req, res, next) {
  try {
    const mystery = await caseById(req.params.id);
    if (mystery.status !== 'FAILED') throw new HttpError(409, 'Only failed cases can be retried.', 'RETRY_NOT_ALLOWED');
    if (mystery.retryCount >= env.MAX_CASE_RETRIES) throw new HttpError(409, 'This case has reached its retry limit. Create a new case to try again.', 'RETRY_LIMIT_REACHED');
    if (!reserveGeneration()) throw new HttpError(503, 'The investigation room is at capacity. Please try again shortly.', 'GENERATION_CAPACITY');
    let updated;
    try { updated = await Mystery.findOneAndUpdate({ _id: mystery._id, status: 'FAILED', retryCount: { $lt: env.MAX_CASE_RETRIES } }, { $set: { status: 'GENERATING', generationAttempts: 0 }, $inc: { retryCount: 1 }, $unset: { failureMessage: 1, suspects: 1, events: 1, evidence: 1, solution: 1, resultExplanation: 1 } }, { new: true }); }
    catch (error) { releaseGeneration(); throw error; }
    if (!updated) { releaseGeneration(); throw new HttpError(409, 'This case has already been retried or reached its retry limit.', 'RETRY_NOT_ALLOWED'); }
    setImmediate(() => runGeneration(updated._id).catch((error) => console.error('Generation task error:', error.message)));
    return send(res, { id: String(updated._id), status: updated.status }, 202);
  } catch (error) { return next(error); }
}
