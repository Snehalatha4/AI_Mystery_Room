# Implementation Plan

`spec.md` is the source of truth. This plan records the current MVP implementation state.

## Phase 1 — Foundation

- [x] React/Vite and Express applications.
- [x] Environment parsing, MongoDB connection, health endpoint, CORS, Helmet, request size cap and API error envelope.
- [x] Shared local development commands.

## Phase 2 — Core product UI

- [x] Landing page and scenario creation form with client validation and difficulty/evidence preferences.
- [x] Loading and retry screen.
- [x] Responsive case workspace with evidence filters/search/sort, suspect profiles, timeline and evidence detail dialog.
- [x] One-suspect accusation flow with confirmation and result screen.

## Phase 3 — Gemini integration

- [x] Server-only official Google Gen AI SDK integration with structured JSON.
- [x] Separate case-plan and evidence generation stages.
- [x] Bounded retries with validation feedback.

## Phase 4 — Database and API

- [x] Mongoose case model and TTL index.
- [x] Asynchronous case creation/status polling and persistence.
- [x] Recover interrupted generation records at server startup, bounded by configured concurrency.
- [x] Public serializers, evidence/suspect/timeline retrieval, persisted one-time accusation and authorized result retrieval.

## Phase 5 — Evidence media

- [x] Chat, photo description, simulated CCTV, witness, physical and document evidence renderers.
- [x] Photo/CCTV assets are honestly labeled simulated; no provider-generated media URLs are accepted.

## Phase 6 — Logic and security

- [x] Deterministic ID/reference/culprit/timeline/decisive-clue/exclusion checks.
- [x] Server-only solution serialization and atomic accusation submission.
- [x] Rate limiting, request validation, response size limits, CORS, security headers and generation concurrency cap.

## Phase 7 — Verification

- [x] Backend unit tests for validation, solvability and privacy serializers.
- [x] Install dependencies and run backend tests and client production build.
- [ ] Run full live flow with configured MongoDB and Gemini key; this requires external credentials/services.
- [ ] Perform browser and mobile viewport review.

## Current blockers / follow-up

- Live end-to-end verification needs a reachable MongoDB instance and the user's Gemini API key in `.env`.
- Browser testing at desktop and mobile viewport sizes has not been performed.
- Actual photo or video generation is outside this configured MVP; clearly labeled simulated evidence is implemented.
