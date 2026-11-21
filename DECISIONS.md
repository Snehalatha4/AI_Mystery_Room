# Decisions

`spec.md` remains the source of truth. These notes record implementation choices that fit its requirements.

| Decision | Reason |
|---|---|
| Use current `@google/genai` and configure `GEMINI_MODEL` | Official Google Gen AI JavaScript SDK with current structured JSON output configuration. The starter model is `gemini-3.8-flash`; verify availability for the user's API account. |
| Build the plan and evidence in separate model calls | Fixes the culprit and event plan before evidence generation, reducing evidence/story drift. |
| Keep the solution embedded in a Mongoose field with `select: false`, and use explicit response serializers | Makes accidental document serialization less likely while retaining atomic case persistence. |
| Do not enable hosted image/video providers by default | No provider credentials or storage configuration are part of the supplied project. Text descriptions and simulated CCTV are labeled truthfully. |
| Use anonymous case access by opaque MongoDB case ID, with a one-time server-checked accusation | Fits the MVP without collecting player identity data. Case IDs should be treated as private links. |
| Retain the existing lowercase `spec.md` filename | Windows paths are case-insensitive, so it represents the required `SPEC.md` file in this workspace without duplicating the source of truth. |


## DEC-004 — Multi-provider generation and deterministic backup
- Date: 2026-11-21
- Context: Gemini free-tier daily quota exhaustion prevented case creation, and switching to another Gemini model did not resolve project quota limits.
- Options considered: retry Gemini, add a second provider, or use a static case when providers fail.
- Decision: Try configured Gemini first, then configured OpenAI, then validate and use a built-in prewritten case. Daily Gemini quota errors skip Gemini model retries. The predefined case is clearly labeled and may not match the submitted story seed.
- Consequences: OpenAI API credentials and billing are optional; the app remains playable without either AI key. The same solvability validator applies to AI and predefined cases.
- Spec sections affected: generation service, provider configuration, loading/investigation UX.
