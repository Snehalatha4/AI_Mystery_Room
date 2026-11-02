import { z } from 'zod';

export const categories = ['THEFT','MURDER_MYSTERY','MISSING_PERSON','CORPORATE_ESPIONAGE','BLACKMAIL','DISAPPEARANCE','GENERAL_MYSTERY'];
export const difficultyCounts = { EASY: { suspects: 3, evidenceMin: 6, evidenceMax: 8 }, MEDIUM: { suspects: 4, evidenceMin: 9, evidenceMax: 12 }, HARD: { suspects: 5, evidenceMin: 13, evidenceMax: 16 } };
export const createMysterySchema = z.object({
  scenario: z.string().trim().min(30).max(2000),
  category: z.enum(categories).default('GENERAL_MYSTERY'),
  difficulty: z.enum(['EASY','MEDIUM','HARD']).default('MEDIUM'),
  preferences: z.object({ setting: z.string().trim().max(100).optional().default(''), evidenceTypes: z.array(z.enum(['CHAT','IMAGE','CCTV','WITNESS_STATEMENT','PHYSICAL','DOCUMENT'])).max(6).optional().default([]) }).optional().default({}),
}).strict();
export const accusationSchema = z.object({ suspectId: z.string().min(1).max(80), explanation: z.string().max(1000).optional().default('') }).strict();

const idText = z.string().trim().min(1).max(100);
const dateValue = z.coerce.date();
export const generatedCaseSchema = z.object({
  title: z.string().trim().min(3).max(120), summary: z.string().trim().min(20).max(500), setting: z.string().trim().min(2).max(160),
  suspects: z.array(z.object({ suspectId: idText, name: z.string().trim().min(2).max(100), age: z.string().max(30), role: z.string().trim().min(2).max(120), relationship: z.string().trim().min(2).max(300), motive: z.string().trim().min(10).max(500), alibi: z.string().trim().min(10).max(600), suspiciousBehavior: z.string().trim().min(5).max(400), publicFacts: z.array(z.string().trim().min(1).max(300)).min(1).max(8), secret: z.string().trim().min(5).max(500) })),
  events: z.array(z.object({ eventId: idText, timestamp: dateValue, endTimestamp: z.union([dateValue, z.literal('')]).optional(), description: z.string().trim().min(10).max(500), location: z.string().max(160), suspectIds: z.array(idText), evidenceIds: z.array(idText) })),
  evidence: z.array(z.object({ evidenceId: idText, type: z.enum(['CHAT','IMAGE','CCTV','WITNESS_STATEMENT','PHYSICAL','DOCUMENT']), title: z.string().trim().min(3).max(120), summary: z.string().trim().min(10).max(300), content: z.string().trim().min(20).max(4000), timestamp: dateValue.optional(), source: z.string().trim().min(2).max(200), suspectIds: z.array(idText), eventIds: z.array(idText), reliability: z.string().trim().min(2).max(160), clueRole: z.enum(['PRIMARY_CLUE','SUPPORTING_CLUE','RED_HERRING','NEUTRAL']), mediaCaption: z.string().max(300).optional(), media: z.object({ status: z.string().optional(), caption: z.string().optional(), isSimulated: z.boolean().optional(), url: z.string().optional() }).optional() })),
  solution: z.object({ culpritSuspectId: idText, motive: z.string().trim().min(10).max(600), method: z.string().trim().min(10).max(600), opportunity: z.string().trim().min(10).max(600), timelineExplanation: z.string().trim().min(20).max(2000), decisiveEvidenceIds: z.array(idText).min(2).max(6), suspectExclusions: z.array(z.object({ suspectId: idText, reason: z.string().trim().min(10).max(600) })), reasoningSummary: z.string().trim().min(30).max(2000) }),
});
