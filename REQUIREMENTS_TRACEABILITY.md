# Requirements Traceability

`spec.md` is authoritative. This table maps its key requirements to implementation and automated coverage.

| Requirement | Implementation | Verification |
|---|---|---|
| FR-001 landing page | `client/src/App.jsx` (`Home`), `client/src/styles.css` | Manual/browser review pending |
| FR-002 scenario validation and difficulty | `client/src/App.jsx` (`Create`), `server/src/validators/mystery.js` | `server/test/solvability.test.js` input test |
| FR-003 structured Gemini generation | `server/src/services/geminiService.js`, `server/src/services/mysteryGenerationService.js` | Provider integration pending configured credentials |
| FR-004 investigation workspace | `client/src/App.jsx` (`Investigation`) | Manual/browser review pending |
| FR-005 private suspect details | `server/src/models/Mystery.js`, `server/src/services/solvabilityService.js` | Serializer privacy test |
| FR-006 evidence types and truthful media | `client/src/App.jsx` (`EvidenceModal`), `server/src/services/geminiService.js` | Manual review pending |
| FR-007 evidence filters, search, sort, examined state | `client/src/App.jsx` (`Investigation`) | Manual/browser review pending |
| FR-008 timeline | `client/src/App.jsx` (`Investigation`), `server/src/controllers/mysteryController.js` | Reference/chronology validator test |
| FR-009 one-time accusation | `server/src/controllers/mysteryController.js` | Database integration test pending |
| FR-010 solution reveal | `server/src/controllers/mysteryController.js`, `client/src/App.jsx` (`Results`) | Database integration test pending |
| FR-011 persistence and recovery | `server/src/models/Mystery.js`, `server/src/controllers/mysteryController.js` | MongoDB integration test pending |
| AC-07 solution privacy | `publicMystery`, `publicSuspects`, `publicEvidence` serializers | `server/test/solvability.test.js` |
| AC-12 API security | `server/src/app.js`, input schemas, env config | Manual/configuration review pending |

The current test suite is focused on deterministic backend invariants. Live provider and MongoDB flows need configured external services.
