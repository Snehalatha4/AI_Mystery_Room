# AI Mystery Room

AI Mystery Room turns a short fictional scenario into an interactive investigation. Create a case, inspect the suspect profiles, evidence and timeline, then make one accusation. The server keeps the culprit and solution private until that accusation is evaluated.

This repository follows [`spec.md`](./spec.md) as its source of product and technical requirements. On Windows, `SPEC.md` and `spec.md` resolve to the same path; the existing specification file remains authoritative.

## Stack

- React, Vite, React Router and Lucide on the client.
- Express, Mongoose and MongoDB on the server.
- Google's official `@google/genai` JavaScript SDK for server-side structured generation, plus OpenAI's HTTPS API as an optional alternate provider.
- Zod for request validation; native Node test runner for invariant tests.

## Requirements

- Node.js 20 or later.
- MongoDB running locally or a reachable MongoDB Atlas connection.
- A Google AI Studio Gemini API key (optional when using OpenAI fallback or the predefined backup).
- An OpenAI API key is recommended for the second AI-provider fallback. OpenAI API billing is separate from a ChatGPT subscription.

## Setup

1. Copy `.env.example` to `.env` in the repository root.
2. Set `GEMINI_API_KEY` and `OPENAI_API_KEY` in the root `.env` for the full Gemini → OpenAI → predefined fallback chain. Configure `OPENAI_MODEL` if desired. If neither key is present, the server still starts and serves the predefined mystery backup.
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

The React app is served at `http://localhost:5173`; the API is served at `http://localhost:5000`. The backend validates its configuration and MongoDB connection at startup. At least one AI key is not required because a validated predefined mystery is always available as the final fallback. Keep the Gemini key in the root `.env`; it is never exposed through a Vite variable.

## Useful commands

```sh
npm run dev             # client and server
npm run build           # production client build
npm test                # backend invariant tests
```

Health check: `GET http://localhost:5000/health`.

## How generation works

Case creation is asynchronous. Gemini requests use `GEMINI_REQUEST_TIMEOUT_MS` (15 seconds by default), separate from the OpenAI timeout. A daily Gemini quota error starts a 24-hour in-process cooldown and skips Gemini retries while the server remains running; generation moves to OpenAI, then to the validated, prewritten Clocktower Ledger mystery if both AI providers fail or are not configured. Each AI-generated case is checked for IDs, references, evidence count, decisive clues, timeline ordering and suspect exclusions before it can become `READY`. The backup is clearly labeled in the investigation room and may not match the submitted scenario. Invalid AI results get a bounded repair attempt.

The public case, evidence, suspect and timeline endpoints use explicit serializers. Suspect secrets and the solution stay in server-only fields. Accusation correctness is a MongoDB-backed server decision; only after it is stored does the API return the reveal. Each case accepts one accusation. Per-case retry attempts are capped by `MAX_CASE_RETRIES`; cases expire after the configured TTL.

## Media behavior and limitations

The current MVP generates text records. Evidence cards for photographs are descriptive, clearly simulated records; CCTV evidence is represented as a simulated transcript or event description. No real photograph or playable video is generated or hosted. The UI says when a record is simulated. There is no login, multiplayer, cross-device anonymous progress, or public sharing.

## Project tracking

- `spec.md`: authoritative product and engineering requirements.
- `IMPLEMENTATION_PLAN.md`: phases and current state.
- `REQUIREMENTS_TRACEABILITY.md`: requirements mapped to code and tests.
- `DECISIONS.md`: implementation decisions and constraints.
