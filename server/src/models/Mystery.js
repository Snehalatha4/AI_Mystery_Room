import mongoose from 'mongoose';
import { env } from '../config/env.js';

const suspectSchema = new mongoose.Schema({
  suspectId: { type: String, required: true }, name: { type: String, required: true },
  age: { type: String, default: '' }, role: { type: String, required: true },
  relationship: { type: String, required: true }, motive: { type: String, required: true },
  alibi: { type: String, required: true }, suspiciousBehavior: { type: String, required: true }, publicFacts: { type: [String], default: [] },
  secret: { type: String, required: true },
}, { _id: false });
const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true }, timestamp: { type: Date, required: true },
  endTimestamp: Date, description: { type: String, required: true }, location: String,
  suspectIds: { type: [String], default: [] }, evidenceIds: { type: [String], default: [] },
}, { _id: false });
const evidenceSchema = new mongoose.Schema({
  evidenceId: { type: String, required: true }, type: { type: String, enum: ['CHAT','IMAGE','CCTV','WITNESS_STATEMENT','PHYSICAL','DOCUMENT'], required: true },
  title: { type: String, required: true }, summary: { type: String, required: true }, content: { type: String, required: true },
  timestamp: Date, source: { type: String, required: true }, suspectIds: { type: [String], default: [] },
  eventIds: { type: [String], default: [] }, reliability: { type: String, required: true },
  clueRole: { type: String, enum: ['PRIMARY_CLUE','SUPPORTING_CLUE','RED_HERRING','NEUTRAL'], required: true },
  media: { status: { type: String, default: 'UNAVAILABLE' }, url: String, mimeType: String, caption: String, isSimulated: { type: Boolean, default: true } },
}, { _id: false });
const solutionSchema = new mongoose.Schema({
  culpritSuspectId: { type: String, required: true }, motive: String, method: String, opportunity: String,
  timelineExplanation: String, decisiveEvidenceIds: [String], suspectExclusions: [{ suspectId: String, reason: String }],
  reasoningSummary: String, solvabilityScore: Number,
}, { _id: false });
const mysterySchema = new mongoose.Schema({
  title: { type: String, required: true }, scenario: { type: String, required: true, maxlength: 2000 },
  category: { type: String, required: true }, difficulty: { type: String, enum: ['EASY','MEDIUM','HARD'], required: true },
  summary: { type: String, required: true }, setting: String, evidencePreferences: { type: [String], default: [] },
  status: { type: String, enum: ['GENERATING','VALIDATING','GENERATING_MEDIA','READY','FAILED'], default: 'GENERATING', index: true },
  failureMessage: String, suspects: [suspectSchema], events: [eventSchema], evidence: [evidenceSchema],
  solution: { type: solutionSchema, select: false },
  accusation: { submitted: { type: Boolean, default: false }, suspectId: String, explanation: String, correct: Boolean, submittedAt: Date },
  resultExplanation: { type: String, select: false }, generationAttempts: { type: Number, default: 0 }, retryCount: { type: Number, default: 0 },
}, { timestamps: true, minimize: false });

mysterySchema.index({ createdAt: 1 }, { expireAfterSeconds: env.CASE_TTL_DAYS * 86400 });
mysterySchema.index({ status: 1, createdAt: -1 });
export const Mystery = mongoose.model('Mystery', mysterySchema);
