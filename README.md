# AI Mystery Room

AI Mystery Room turns a short fictional scenario into an interactive investigation. Create a case, inspect the suspect profiles, evidence and timeline, then make one accusation. The server keeps the culprit and solution private until that accusation is evaluated.

This repository follows [`spec.md`](./spec.md) as its source of product and technical requirements. On Windows, `SPEC.md` and `spec.md` resolve to the same path; the existing specification file remains authoritative.

## Stack

- React, Vite, React Router and Lucide on the client.
- Express, Mongoose and MongoDB on the server.
- Google's official `@google/genai` JavaScript SDK for server-side structured generation.
- Zod for request validation; native Node test runner for invariant tests.

## Requirements

- Node.js 20 or later.
- MongoDB running locally or a reachable MongoDB Atlas connection.
- A Google AI Studio Gemini API key.

## Setup

1. Copy `.env.example` to `.env` in the repository root.
2. Set `GEMINI_API_KEY` and, if needed, `MONGODB_URI`, `GEMINI_MODEL`, `GEMINI_MAX_OUTPUT_TOKENS`, `CLIENT_URL`, and `PORT`.
3. Install the workspace dependencies:

   ```sh
   npm install
   npm --prefix client install
   npm --prefix server install
   ```

4. Start both apps:

   ```sh
   npm run dev
   ```

The React app is served at `http://localhost:5173`; the API is served at `http://localhost:5000`. The backend validates its configuration and MongoDB connection at startup. Keep the Gemini key in the root `.env`; it is never exposed through a Vite variable.

## Useful commands

```sh
npm run dev             # client and server
npm run build           # production client build
npm test                # backend invariant tests
```

Health check: `GET http://localhost:5000/health`.

## How generation works

Case creation is asynchronous. The server creates a `GENERATING` case, asks Gemini to establish the case plan and fixed culprit, asks it to build evidence from that plan, then checks IDs, references, evidence count, decisive clues, timeline ordering and suspect exclusions before marking the case `READY`. Invalid results get a bounded retry with validation feedback. A failed case is not playable and can be retried from its loading page.

The public case, evidence, suspect and timeline endpoints use explicit serializers. Suspect secrets and the solution stay in server-only fields. Accusation correctness is a MongoDB-backed server decision; only after it is stored does the API return the reveal. Each case accepts one accusation. Per-case retry attempts are capped by `MAX_CASE_RETRIES`; cases expire after the configured TTL.

## Media behavior and limitations

The current MVP generates text records. Evidence cards for photographs are descriptive, clearly simulated records; CCTV evidence is represented as a simulated transcript or event description. No real photograph or playable video is generated or hosted. The UI says when a record is simulated. There is no login, multiplayer, cross-device anonymous progress, or public sharing.

## Project tracking

- `spec.md`: authoritative product and engineering requirements.
- `IMPLEMENTATION_PLAN.md`: phases and current state.
- `REQUIREMENTS_TRACEABILITY.md`: requirements mapped to code and tests.
- `DECISIONS.md`: implementation decisions and constraints.
