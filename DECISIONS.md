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
