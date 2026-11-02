# AI MYSTERY ROOM
## Single Source of Truth — Product & Technical Specification

**Document ID:** AMR-SSOT-001  
**Version:** 1.0.0  
**Status:** Initial implementation specification  
**Project Type:** AI-powered interactive mystery investigation web application  
**Development Methodology:** Spec-Driven Development (SDD)  
**Frontend:** React + Vite  
**Backend:** Node.js + Express.js  
**Database:** MongoDB + Mongoose  
**AI Provider:** Google Gemini API  
**Primary Language:** JavaScript (ES Modules)  
**Primary Audience:** Players who enjoy solving fictional mysteries through evidence analysis

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Vision

AI Mystery Room is an interactive web application that transforms a user-provided scenario, story, or fictional incident into a complete, playable mystery investigation.

The AI creates a fictional case containing:
- A detailed incident and background story.
- A set of suspects, each with a distinct motive and alibi.
- One predetermined culprit.
- A chronological timeline of events.
- AI-generated evidence, including chat conversations, photographs, CCTV-style recordings or transcripts, witness statements, and physical clues.
- Contradictions, red herrings, and connections between pieces of evidence.
- A final solution with a clear, logically supported explanation.

Players investigate the case, examine evidence, compare suspect statements, identify contradictions, and select the person they believe committed the crime.

The application evaluates the player's final accusation against the case's predetermined solution and provides an explanation of the correct reasoning.

## 1.2 Core User Story

As a player, I want to enter a short story or scenario and receive a complete, interactive mystery so that I can investigate evidence and determine who is responsible.

Example input:

"A valuable diamond disappeared from a mansion during a private dinner. Five people were present, and the security cameras stopped working for ten minutes."

The system should generate a fictional investigation with suspects, evidence, a coherent timeline, and one culprit.

The player examines the available evidence and submits an accusation.

The application then reveals whether the accusation was correct and explains which clues support the conclusion.

## 1.3 Product Principles

1. **Logical solvability:** Every mystery must contain sufficient evidence to identify the culprit.
2. **Solution consistency:** The culprit is fixed before gameplay begins and never changes in response to player guesses.
3. **Evidence integrity:** Evidence must support the underlying timeline and character facts.
4. **AI-generated fiction:** All generated incidents, people, messages, photographs, and recordings are fictional game content.
5. **Player agency:** Players must investigate and choose a culprit themselves.
6. **Graceful degradation:** The application must communicate AI or media-generation failures without corrupting a case.
7. **Privacy:** User-provided stories and gameplay data must not be exposed to other users.
8. **Transparent completion:** The application must distinguish successful case generation from partial or failed generation.

---

# 2. PROJECT SCOPE

## 2.1 MVP — Mandatory Features

The initial release must include:

- Landing page with product introduction.
- Scenario submission form.
- Mystery difficulty selection.
- Mystery generation through Gemini.
- Persistent mystery storage in MongoDB.
- A playable investigation interface.
- Multiple suspects and detailed profiles.
- Evidence board and evidence detail views.
- AI-generated WhatsApp-style conversations.
- AI-generated photographs or image-based clues.
- CCTV-style evidence, including generated video where supported or clearly labeled simulated footage.
- Witness statements and physical evidence.
- Timeline of events.
- Suspect comparison and contradiction analysis.
- Culprit selection and accusation submission.
- Correct/incorrect result screen.
- Explanation of the solution.
- Case loading and persistence.
- Loading, empty, error, and retry states.
- Responsive desktop and mobile layouts.
- Basic input validation, API security, and AI cost controls.

## 2.2 Optional or Future Features

These are not required for the initial release:

- User accounts and authentication.
- Public case sharing.
- Community-created mysteries.
- Multiplayer investigations.
- Leaderboards and achievements.
- Hint purchasing or scoring penalties.
- Voice interrogation.
- AI-generated playable video clips.
- Real-time collaborative evidence boards.
- Case ratings and comments.
- Administrative analytics dashboard.

Do not implement optional features at the expense of the required MVP.

---

# 3. USERS AND USER JOURNEY

## 3.1 Target Users

- Casual players who enjoy detective stories.
- Mystery and crime-fiction enthusiasts.
- Students exploring interactive storytelling.
- Users interested in AI-generated games.

## 3.2 Primary User Journey

1. The user opens the landing page.
2. The user clicks **Create a Mystery**.
3. The user enters a story or incident.
4. The user chooses difficulty and optional settings.
5. The application validates the input.
6. The backend asks Gemini to construct the case.
7. The backend validates the generated mystery for structural and logical consistency.
8. The system generates or prepares evidence assets.
9. The completed case is saved in MongoDB.
10. The player enters the investigation room.
11. The player explores suspects, evidence, and the event timeline.
12. The player selects a culprit.
13. The player submits the accusation.
14. The application evaluates the accusation against the stored solution.
15. The player sees the outcome and explanation.

The player must not see the culprit or solution before submitting an accusation.

---

# 4. FUNCTIONAL REQUIREMENTS

## FR-001: Landing Page

The landing page must contain:

- Product name and logo.
- A clear headline explaining the experience.
- A short description of the mystery-generation process.
- A primary CTA: "Create a Mystery".
- A secondary CTA: "Explore How It Works".
- A three-step explanation: Create, Investigate, Solve.
- Example evidence previews.
- A footer with project information and a fictional-content disclaimer.

The primary CTA must navigate to the mystery creation interface.

## FR-002: Scenario Creation

The creation form must include:

- Scenario or story text.
- Mystery category.
- Difficulty.
- Optional preferred setting.
- Optional evidence preferences.

Supported categories:

- Theft
- Murder mystery
- Missing person
- Corporate espionage
- Blackmail
- Disappearance
- General mystery

The user may also provide an original scenario that does not fit a listed category.

Supported difficulty levels:

- **Easy:** 3 suspects, approximately 6–8 evidence items, clear clues.
- **Medium:** 4 suspects, approximately 9–12 evidence items, indirect clues and contradictions.
- **Hard:** 5 suspects, approximately 13–16 evidence items, interconnected clues and plausible red herrings.

These are generation targets, not guarantees of a specific number of successfully generated media assets.

Input rules:

- Scenario must not be empty.
- Scenario must be between 30 and 2,000 characters.
- All optional fields must have documented length limits.
- Client-side and server-side validation are mandatory.
- Display a useful validation message for invalid input.
- Do not start generation if validation fails.

The form must explain that the AI generates fictional evidence.

## FR-003: Mystery Generation

The backend must generate a complete case with:

- Case title and summary.
- Incident details.
- Location and relevant background.
- Suspects and their relationships.
- Exactly one primary culprit.
- Suspect motives, alibis, and secrets.
- Event timeline.
- Evidence records.
- Evidence-to-suspect relationships.
- Clues and contradictions.
- A solution explanation.
- A logical solvability assessment.

Generation must use Gemini through the server-side API.

The Gemini API key must never be included in client-side code.

The generated result must conform to the backend's schema before it is saved.

If Gemini returns malformed JSON, the backend must attempt a bounded repair or regeneration process. It must not save malformed or incomplete cases as playable cases.

## FR-004: Investigation Room

The investigation room is the primary gameplay interface.

It must contain the following sections:

1. Case overview.
2. Suspects.
3. Evidence board.
4. Timeline.
5. Accusation panel.

The layout should support navigation without losing the player's investigation context.

The player must be able to:

- Open a suspect profile.
- Examine an evidence item.
- Read a complete message conversation.
- View an image or CCTV-style evidence asset.
- Read witness statements.
- View event timestamps.
- Compare suspect claims against evidence.
- Return to the evidence board.
- Submit an accusation.

Do not reveal hidden solution fields through the frontend API.

## FR-005: Suspect Profiles

Every suspect must have:

- Unique suspect ID.
- Display name.
- Age or age range where appropriate.
- Role in the scenario.
- Relationship to the victim or incident.
- Publicly known motive or relevant background.
- Alibi.
- Known facts.
- Potentially suspicious behavior.

Private secrets and the actual culprit identity must remain on the server until the accusation has been evaluated.

Suspects must have distinguishable profiles. Avoid generating multiple suspects with interchangeable motives or identical personalities.

## FR-006: Evidence System

Every evidence item must contain:

- Unique evidence ID.
- Evidence type.
- Title.
- Short description.
- Detailed content.
- Timestamp or relevant time interval.
- Source or origin.
- Related suspect IDs.
- Related event IDs.
- Reliability assessment.
- Whether it is a primary clue, supporting clue, or red herring.
- Media status.
- Optional media URL or media metadata.

Supported evidence types:

### A. Chat Messages

Display a fictional messaging interface containing:

- Sender and recipient.
- Message text.
- Timestamp.
- Conversation grouping.
- Optional attachment references.

Messages must be generated as evidence, not as real messages retrieved from external accounts.

### B. Photographs

Images may depict:

- A fictional crime scene.
- An object in a suspicious location.
- A damaged item.
- An inconsistent background detail.
- A fictional suspect or setting.

Image generation must use an explicitly configured image-generation provider if actual images are required. Gemini text generation alone must not be assumed to produce a hosted image URL.

If image generation is unavailable, the application may use an approved local placeholder or a text-based evidence card. It must clearly identify the fallback and must not present it as an actual AI-generated photograph.

### C. CCTV-Style Recordings

The MVP must support CCTV-style evidence through:

- A recording-style player or simulated viewer.
- Recording timestamp.
- Location or camera identifier.
- A generated description of observed events.
- Optional generated frames or video assets.

If actual video generation is unavailable, use a simulated CCTV viewer with still frames, a timeline, and a clearly labeled AI-generated transcript or event description.

Never label a text transcript as a playable video recording.

### D. Witness Statements

Statements must include:

- Witness identity.
- Time of statement.
- Statement text.
- Related events.
- Potential inconsistencies.

### E. Physical Evidence

Examples include:

- Fingerprint report.
- Receipt.
- Access log.
- Keycard record.
- Handwritten note.
- Object-location record.

For an MVP, these can be fictional structured records rather than externally verified forensic reports.

## FR-007: Evidence Board

The evidence board must display evidence as organized cards.

Players must be able to:

- Filter by evidence type.
- Filter by related suspect.
- Sort chronologically.
- Open evidence details.
- Identify evidence that has been examined.

If practical, allow the player to pin evidence or create simple connections between evidence items.

Evidence connections are optional for the MVP; examining evidence and navigating between related records are mandatory.

## FR-008: Timeline

The timeline must represent events in chronological order.

Each event must include:

- Event ID.
- Start time or timestamp.
- Optional end time.
- Description.
- Related suspects.
- Related evidence.
- Location where applicable.

The timeline must use a consistent timezone or clearly state that the case uses fictional local times.

If events conflict, the application must explain the discrepancy as a potential clue rather than silently displaying contradictory facts.

## FR-009: Culprit Selection

The accusation panel must:

- Display eligible suspects.
- Require exactly one primary suspect selection.
- Allow an optional explanation from the player.
- Require explicit submission.
- Prevent accidental duplicate submissions.
- Display a confirmation before the final accusation when appropriate.

On submission, the frontend sends only the selected suspect ID and optional explanation to the backend.

The backend must compare the selected ID with the authoritative stored solution.

The frontend must never decide whether the answer is correct.

## FR-010: Results and Solution Reveal

After a valid accusation:

- Show whether the accusation was correct.
- Reveal the culprit.
- Display the decisive clues.
- Explain the culprit's motive and opportunity.
- Explain important contradictions.
- Explain why major alternative suspects were not responsible.
- Display a chronological reconstruction of the incident.
- Show an option to return to the case or create another mystery.

The result must be generated from the stored case solution and evidence.

Do not ask Gemini to independently choose the correct culprit after the player submits an answer.

## FR-011: Persistence and Recovery

Cases must be persisted in MongoDB.

A case must be retrievable by its ID.

Refreshing the investigation page must not destroy the case or its evidence.

The system must distinguish:

- Generating
- Validating
- Generating media
- Ready
- Failed

A failed generation must not appear as a fully playable mystery.

If generation fails, provide a retry option and a clear explanation without exposing API keys, stack traces, or internal prompts.

---

# 5. TECHNICAL ARCHITECTURE

## 5.1 Technology Stack

### Frontend
- React
- Vite
- React Router
- JavaScript ES Modules
- Tailwind CSS
- Lucide React icons
- Fetch API or Axios
- A lightweight state-management approach appropriate to the MVP

### Backend
- Node.js
- Express.js
- JavaScript ES Modules
- Mongoose
- Google Gemini SDK or the currently supported official Google Gen AI SDK
- Zod or an equivalent server-side validation library
- Centralized error handling
- Structured logging

### Database
- MongoDB
- MongoDB Atlas or a local MongoDB instance
- Mongoose schemas and indexes

### AI
- Google Gemini for scenario analysis, story generation, suspect generation, evidence generation, and solution explanation.
- An explicitly configured image-generation provider for actual generated photographs if needed.
- An explicitly configured video-generation provider only if actual generated video is implemented.

Provider choice and model identifiers must be configured rather than scattered throughout the source code.

Before implementation, verify the currently supported Gemini SDK, model names, structured-output capabilities, and API constraints. Do not assume a deprecated SDK or a particular model identifier is available.

## 5.2 High-Level Architecture

Browser → React application → Express API → Validation and orchestration layer → Gemini API → Case validation → MongoDB → Sanitized case response → Browser.

Media generation, if enabled, follows a separate provider integration and asset-storage flow.

The browser must not call Gemini directly.

## 5.3 Responsibilities

### React Frontend

Responsible for:

- User input and navigation.
- Rendering case information.
- Evidence exploration.
- Suspect selection.
- Loading and error states.
- Sending requests to the backend.
- Displaying the results returned by the backend.

### Express Backend

Responsible for:

- Input validation.
- Case-generation orchestration.
- Gemini integration.
- Schema validation.
- Logical consistency checks.
- Culprit secrecy.
- Database persistence.
- Accusation evaluation.
- Rate limiting and cost controls.
- Error handling.

### Gemini

Responsible for:

- Interpreting the user scenario.
- Generating the fictional case.
- Generating suspects, events, and evidence.
- Producing a structured explanation of the intended solution.
- Suggesting contradictions and clues.

Gemini is a content generator, not the authoritative runtime evaluator.

### MongoDB

Responsible for storing:

- Mystery cases.
- Suspects.
- Events.
- Evidence.
- Internal solution data.
- Generation status.
- Player progress and accusation results where needed.

---

# 6. DATA MODEL

Use Mongoose schemas with explicit field types, validation, and indexes.

## 6.1 Mystery

Required fields:

- `_id`
- `title`
- `scenario`
- `category`
- `difficulty`
- `summary`
- `setting`
- `status`
- `suspects`
- `events`
- `evidence`
- `solution`
- `generationMetadata`
- `createdAt`
- `updatedAt`

The `status` enum must include:

- `GENERATING`
- `VALIDATING`
- `GENERATING_MEDIA`
- `READY`
- `FAILED`

Only `READY` cases can be played.

## 6.2 Suspect

Fields:

- `suspectId`
- `name`
- `role`
- `age`
- `relationship`
- `motive`
- `alibi`
- `publicFacts`
- `secret`
- `isCulprit` (server-only)

`isCulprit` must never be included in ordinary suspect API responses.

## 6.3 Event

Fields:

- `eventId`
- `timestamp`
- `endTimestamp`
- `description`
- `location`
- `suspectIds`
- `evidenceIds`

All referenced IDs must correspond to existing records in the same case.

## 6.4 Evidence

Fields:

- `evidenceId`
- `type`
- `title`
- `summary`
- `content`
- `timestamp`
- `source`
- `suspectIds`
- `eventIds`
- `reliability`
- `clueRole`
- `media`

Enums:

`type`: `CHAT`, `IMAGE`, `CCTV`, `WITNESS_STATEMENT`, `PHYSICAL`, `DOCUMENT`

`clueRole`: `PRIMARY_CLUE`, `SUPPORTING_CLUE`, `RED_HERRING`, `NEUTRAL`

`media` may contain:

- `status`
- `url`
- `mimeType`
- `caption`
- `isSimulated`

Media URLs must point to approved storage or local assets, not arbitrary URLs generated by the model.

## 6.5 Solution

Server-only fields:

- `culpritSuspectId`
- `motive`
- `method`
- `opportunity`
- `timelineExplanation`
- `decisiveEvidenceIds`
- `suspectExclusions`
- `reasoningSummary`
- `solvabilityScore`

The solution must be stored separately from the public case representation, either in a separate solution collection or in a strictly filtered private field.

Never serialize the complete database document directly to the browser.

## 6.6 Player Progress

For anonymous MVP gameplay, use a case-scoped progress record when persistence is needed.

Fields:

- `caseId`
- `sessionId`
- `examinedEvidenceIds`
- `selectedSuspectId`
- `accusationSubmitted`
- `accusationResult`
- `completedAt`

Use an opaque random session identifier rather than trusting arbitrary user-supplied ownership identifiers.

Do not collect personal information unnecessarily.

---

# 7. GEMINI GENERATION CONTRACT

## 7.1 Generation Strategy

Use a staged generation pipeline rather than a single unconstrained prompt.

### Stage 1: Scenario Analysis

Extract:

- Incident type.
- Setting.
- Constraints.
- Desired tone.
- Potential victim or central subject.
- Feasible mystery structure.

### Stage 2: Case and Solution Design

Generate the complete internal case plan first.

This plan must establish:

- The incident.
- The culprit.
- The culprit's motive.
- The method and opportunity.
- The complete timeline.
- The facts that must remain consistent.
- Each suspect's alibi and secrets.
- The decisive clues.
- The role of red herrings.

The culprit must be fixed in this stage.

### Stage 3: Evidence Generation

Generate evidence based on the established case plan.

Each item must reference existing suspect IDs and event IDs.

Evidence must not introduce new facts that invalidate the planned solution.

### Stage 4: Validation

Check:

- Schema validity.
- Unique IDs.
- Valid references.
- Exactly one culprit.
- Chronological consistency.
- Alibi consistency.
- Evidence-to-solution consistency.
- Sufficient decisive evidence.
- Plausible alternative suspects.
- Absence of solution leaks in public fields.

### Stage 5: Optional Repair

If validation fails, send a focused repair request containing validation errors and the relevant case data.

Limit repair attempts. If the case remains invalid, fail generation and ask the user to retry.

Do not silently relax critical invariants.

### Stage 6: Persistence

Save the validated case and solution.

Set the case to `READY` only after all mandatory generation and validation steps succeed.

## 7.2 Structured Output

Require Gemini to produce structured JSON conforming to a defined schema.

Do not parse arbitrary prose using brittle string splitting or assume that a Markdown code block is valid JSON.

Example internal contract:

```json
{
  "title": "The Last Guest",
  "summary": "A priceless artifact disappears during a private gathering.",
  "suspects": [],
  "events": [],
  "evidence": [],
  "solution": {
    "culpritSuspectId": "suspect_03",
    "motive": "A hidden financial motive",
    "method": "An established method supported by evidence",
    "opportunity": "A timeline-supported opportunity",
    "decisiveEvidenceIds": ["evidence_02", "evidence_07"],
    "reasoningSummary": "An explanation based on the established facts"
  }
}
```

This is a structural illustration only. The actual schema must include all required fields defined in this document.

## 7.3 Prompt Rules

All generation prompts must instruct the model to:

- Treat the user's scenario as fictional game content.
- Create exactly one primary culprit.
- Keep the culprit consistent throughout the case.
- Create distinguishable suspects.
- Generate a chronological, internally consistent timeline.
- Give each important deduction supporting evidence.
- Include plausible but fair red herrings.
- Avoid relying on hidden information unavailable to the player.
- Ensure that the solution is deducible from the presented evidence.
- Use stable IDs for suspects, events, and evidence.
- Return only schema-conforming structured data.
- Avoid real personal data and real-world allegations against identifiable people.
- Avoid including the solution in public summaries, evidence titles, or ordinary API responses.

Do not trust prompt instructions or user-provided scenarios as security controls. Validate all generated content on the server.

---

# 8. SOLVABILITY AND LOGICAL CONSISTENCY

A mystery is not considered playable merely because Gemini returns valid JSON.

The backend must run deterministic consistency checks before publishing the case.

## 8.1 Mandatory Invariants

1. There must be exactly one primary culprit.
2. The culprit must exist in the suspect list.
3. Every referenced suspect, event, and evidence ID must exist.
4. All required timeline events must be chronologically compatible.
5. A suspect must not be declared to have an impossible alibi unless that contradiction is an intentional clue.
6. Every decisive clue must support a documented deduction.
7. The culprit must have an established motive and opportunity.
8. The case must contain enough evidence to distinguish the culprit from innocent suspects.
9. Red herrings must be explainable without making the final solution arbitrary.
10. The player must be able to solve the case using information actually provided.

## 8.2 Solvability Score

Calculate a basic heuristic score from:

- Number of decisive clues.
- Number of independent evidence sources.
- Consistency of timeline.
- Number of contradictions that support the solution.
- Degree to which innocent suspects can be ruled out.

The score is a quality-control heuristic, not proof of mathematical uniqueness.

For the MVP, require at least two independent decisive clues and a documented reason for excluding every innocent suspect.

If the case fails the checks, repair or regenerate it rather than publishing an unfair mystery.

## 8.3 Ground-Truth Separation

Keep the internal solution separate from the public evidence package.

Public endpoints may return only the information needed to investigate.

The accusation endpoint must compare the selected suspect against the stored culprit ID. It must not rely on a new model-generated verdict.

---

# 9. API SPECIFICATION

All API routes must be prefixed with `/api/v1`.

## POST /api/v1/mysteries

Create a mystery.

Request:

```json
{
  "scenario": "A diamond disappeared during a private dinner.",
  "category": "THEFT",
  "difficulty": "MEDIUM",
  "preferences": {
    "setting": "A luxury mansion",
    "evidenceTypes": ["CHAT", "IMAGE", "CCTV"]
  }
}
```

Response: `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "case_id",
    "title": "The Missing Diamond",
    "status": "GENERATING"
  }
}
```

Generation may continue asynchronously. The client must poll the status endpoint or use another documented progress mechanism.

## GET /api/v1/mysteries/:id/status

Returns the generation status, safe progress information, and a user-friendly failure message if applicable.

## GET /api/v1/mysteries/:id

Returns the public case information only when the case is ready.

The response must not include the culprit, solution, private suspect secrets, or hidden generation prompts.

## GET /api/v1/mysteries/:id/evidence

Returns public evidence for the case.

Support optional filters for evidence type, suspect ID, and chronological ordering.

Validate all query parameters.

## GET /api/v1/mysteries/:id/evidence/:evidenceId

Returns a single evidence item after validating that it belongs to the specified case.

## GET /api/v1/mysteries/:id/suspects

Returns public suspect profiles without secret fields or culprit indicators.

## GET /api/v1/mysteries/:id/timeline

Returns the public event timeline.

## POST /api/v1/mysteries/:id/accusations

Submits a final accusation.

Request:

```json
{
  "suspectId": "suspect_03",
  "explanation": "The access log conflicts with the suspect's statement."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "correct": true,
    "culprit": {
      "suspectId": "suspect_03",
      "name": "Example Suspect"
    },
    "explanation": "The stored solution and decisive clues support this result.",
    "decisiveEvidenceIds": ["evidence_02", "evidence_07"]
  }
}
```

The response above represents the post-accusation reveal. Before an accusation, no endpoint may disclose these solution fields.

The backend must validate the case, suspect, request body, and submission state.

## POST /api/v1/mysteries/:id/retry

Retries an eligible failed generation using the existing case record or a new generation attempt, according to the documented retry policy.

Do not create unlimited duplicate generation jobs.

## API Conventions

- Use appropriate HTTP status codes.
- Return a consistent response envelope.
- Validate path parameters and request bodies.
- Use centralized error handling.
- Never expose stack traces or secrets.
- Rate-limit expensive AI endpoints.
- Set request and provider timeouts.
- Apply a reasonable request-body size limit.

---

# 10. FRONTEND ROUTES AND SCREENS

## `/`

Landing page.

## `/create`

Scenario creation form.

## `/mystery/:id/loading`

Generation progress and retry state.

## `/mystery/:id`

Investigation workspace.

## `/mystery/:id/results`

Post-accusation result and solution reveal.

Unknown routes must display a proper not-found page.

The results route must not independently fetch or display the hidden solution before a valid accusation. It must rely on the server's authorized post-accusation response.

---

# 11. UI/UX AND VISUAL DESIGN

## 11.1 Art Direction

The application should feel like a modern detective's investigation room, not a generic AI dashboard.

Design keywords:

- Cinematic.
- Suspenseful.
- Minimal.
- Editorial.
- Evidence-focused.
- Immersive.
- Legible.

Suggested palette:

- Background: deep charcoal or midnight navy.
- Surfaces: layered dark slate.
- Primary accent: muted amber.
- Secondary accent: cool blue.
- Borders: subtle grey.
- Text: off-white with muted secondary text.
- Warning and error colors: accessible semantic colors.

Provide accessible contrast and clear focus indicators.

## 11.2 Layout

Desktop:

- Main navigation or compact case sidebar.
- Central evidence workspace.
- Contextual suspect and timeline panels.

Mobile:

- Single-column investigation view.
- Collapsible navigation.
- Evidence cards with full-width detail views.
- Accessible bottom or top navigation.

Do not squeeze the desktop evidence board into an unusable mobile layout.

## 11.3 Components

Implement reusable components for:

- AppShell
- Navbar
- ScenarioForm
- DifficultySelector
- GenerationProgress
- CaseHeader
- SuspectCard
- SuspectDetail
- EvidenceCard
- EvidenceDetailModal
- ChatEvidenceViewer
- ImageEvidenceViewer
- CctvEvidenceViewer
- Timeline
- EvidenceFilters
- AccusationPanel
- ResultSummary
- SolutionTimeline
- LoadingSkeleton
- ErrorState
- EmptyState
- ConfirmationDialog

## 11.4 Interaction Requirements

- Buttons must perform real actions.
- Evidence cards must open the correct evidence.
- Filters must change visible evidence.
- Navigation must preserve the current case ID.
- Loading states must be visible during network operations.
- Repeated submission must not create duplicate accusations.
- Modals must support keyboard dismissal and focus management.
- Interactive elements must be keyboard accessible.
- Animations must be subtle and must not delay gameplay.
- Avoid decorative controls that appear functional but do nothing.

---

# 12. SECURITY AND PRIVACY

Mandatory requirements:

1. Store Gemini credentials only in backend environment variables.
2. Commit `.env.example`, never actual secrets.
3. Add `.env`, generated media, logs containing sensitive data, and other secrets to `.gitignore` as appropriate.
4. Validate and sanitize all user-controlled input.
5. Validate all model-generated output before persistence.
6. Never expose the internal solution before accusation.
7. Never trust client-supplied culprit IDs or correctness values.
8. Rate-limit case creation and retries.
9. Limit generation concurrency and provider expenditure.
10. Restrict CORS to configured frontend origins in production.
11. Apply security headers using appropriate middleware.
12. Validate media types and file sizes if uploads are introduced.
13. Do not render model-generated HTML as trusted markup.
14. Do not execute code returned by Gemini.
15. Avoid logging full API keys, private solution payloads, or unnecessary user content.
16. Use safe handling for generated asset URLs.
17. Define data retention and deletion behavior for stored cases.
18. Do not imply that fictional evidence is authentic or obtained from real devices.

The application must label the investigation and its evidence as AI-generated fiction.

---

# 13. ERROR HANDLING

Implement consistent handling for:

- Empty or invalid scenarios.
- Gemini authentication errors.
- Gemini quota or rate-limit errors.
- Gemini timeouts.
- Invalid structured output.
- Logical validation failures.
- MongoDB connection failures.
- Missing cases.
- Missing evidence.
- Invalid suspect IDs.
- Duplicate accusations.
- Media-generation failure.
- Invalid media URLs.
- Unexpected server errors.

User-facing messages must be understandable and must not expose internal implementation details.

For example:

"Your mystery could not be generated right now. Your request has not been marked as complete. Please try again."

If mandatory evidence generation fails, either retry according to the bounded retry policy or mark the case as failed. Do not publish a case that silently lacks its required evidence.

Optional media failures may use explicitly labeled fallbacks.

---

# 14. PROJECT STRUCTURE

Use a clean separation between frontend and backend.

```text
ai-mystery-room/
├── SPEC.md
├── README.md
├── .gitignore
├── .env.example
├── package.json
│
├── client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── app/
│       │   ├── App.jsx
│       │   └── router.jsx
│       ├── components/
│       │   ├── layout/
│       │   ├── mystery/
│       │   ├── evidence/
│       │   └── ui/
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── CreateMysteryPage.jsx
│       │   ├── LoadingPage.jsx
│       │   ├── InvestigationPage.jsx
│       │   └── ResultsPage.jsx
│       ├── services/
│       │   └── api.js
│       ├── hooks/
│       ├── utils/
│       └── styles/
│
├── server/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── models/
│       │   ├── Mystery.js
│       │   └── PlayerProgress.js
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       │   ├── geminiService.js
│       │   ├── mysteryGenerationService.js
│       │   ├── evidenceService.js
│       │   ├── solvabilityService.js
│       │   └── accusationService.js
│       ├── validators/
│       ├── middleware/
│       ├── prompts/
│       └── utils/
│
└── tests/
    ├── unit/
    ├── integration/
    └── fixtures/
```

This structure is a target architecture, not permission to create empty files for every listed path. Add modules when they contain real functionality.

---

# 15. ENVIRONMENT CONFIGURATION

Provide `.env.example` with documented variables.

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=
GEMINI_MODEL=

AI_MAX_RETRIES=2
AI_REQUEST_TIMEOUT_MS=60000
MAX_ACTIVE_GENERATIONS=3

CASE_TTL_DAYS=30
```

Treat `GEMINI_MODEL` as a configurable identifier. Set it to a currently supported model during environment setup.

The above values are starting defaults, not guaranteed provider limits or production capacity settings.

Do not put `GEMINI_API_KEY` in any frontend environment variable or Vite-exposed variable.

If actual image or video generation is implemented, add separate provider configuration with documented defaults and costs.

The application must validate required environment variables at startup and fail clearly when mandatory configuration is missing.

---

# 16. TESTING REQUIREMENTS

## 16.1 Unit Tests

Test:

- Scenario validation.
- Difficulty configuration.
- Gemini response parsing.
- Suspect and evidence schema validation.
- Unique ID validation.
- Reference integrity.
- Exactly-one-culprit invariant.
- Timeline consistency checks.
- Solvability checks.
- Public/private field filtering.
- Accusation correctness.
- Retry limits.
- Error mapping.

## 16.2 Integration Tests

Test:

- Creating a mystery.
- Checking generation status.
- Retrieving a completed case.
- Retrieving evidence.
- Retrieving suspect profiles.
- Retrieving the timeline.
- Submitting a correct accusation.
- Submitting an incorrect accusation.
- Rejecting invalid suspect IDs.
- Rejecting duplicate submissions.
- Handling failed AI generation.
- Handling unavailable MongoDB.
- Ensuring the solution is not returned before accusation.

Mock Gemini in deterministic automated tests so tests do not depend on live API access or incur API costs.

## 16.3 Frontend Tests

Test:

- Form validation.
- Difficulty selection.
- Loading and failure states.
- Evidence filters.
- Evidence detail opening and closing.
- Suspect selection.
- Accusation confirmation.
- Result rendering.
- Navigation and refresh behavior.

## 16.4 End-to-End Acceptance Tests

A complete user journey must work:

1. Enter a valid scenario.
2. Generate a case.
3. Wait for the case to become ready.
4. Open the investigation room.
5. Examine multiple evidence items.
6. Inspect suspects and timeline.
7. Submit an accusation.
8. Receive the result.
9. Read the solution explanation.
10. Refresh the case and confirm persistence.

Use deterministic test fixtures for repeatable end-to-end testing.

---

# 17. ACCEPTANCE CRITERIA

The MVP is accepted only when all mandatory criteria pass.

### AC-01: Application startup
The frontend and backend start using documented commands.

### AC-02: Scenario submission
A valid scenario can be submitted, and invalid input is rejected with a useful message.

### AC-03: AI integration
The backend calls Gemini through a server-side service and validates the response.

### AC-04: Case persistence
A successfully generated case is stored and can be retrieved after a page refresh.

### AC-05: Evidence completeness
Every ready case contains its required suspects, timeline, and evidence records.

### AC-06: Evidence integrity
Evidence references valid suspects and events, and the stored solution is consistent with the published evidence.

### AC-07: Solution privacy
The culprit identity and private solution data are not exposed through public case, evidence, suspect, or timeline endpoints.

### AC-08: Accusation
The server correctly evaluates a valid suspect selection against the stored culprit ID.

### AC-09: Results
The player receives a meaningful solution explanation after the accusation.

### AC-10: Error recovery
AI failures, validation failures, and missing resources are handled without crashing the application.

### AC-11: Responsive design
Core workflows remain usable on desktop and mobile viewports.

### AC-12: Security
No API key is shipped to the browser, and AI-generation endpoints have input validation and rate limiting.

### AC-13: Test coverage
The critical generation, privacy, solvability, and accusation rules have automated tests.

### AC-14: Documentation
The README explains installation, environment configuration, startup, testing, and known limitations.

### AC-15: No fake functionality
Every implemented control has a working action, or is explicitly labeled as unavailable or coming later.

---

# 18. IMPLEMENTATION PHASES

## Phase 1: Foundation

- Initialize React/Vite.
- Initialize Express.
- Configure environment variables.
- Connect MongoDB.
- Add health endpoint.
- Establish routing and error handling.
- Create base UI system.

**Exit gate:** Both applications run, MongoDB connects, and the health endpoint succeeds.

## Phase 2: Core Product UI

- Build landing page.
- Build scenario form.
- Build loading screen.
- Build investigation workspace.
- Build suspect and evidence views.
- Build timeline and accusation interface.
- Build results screen.

Use clearly labeled mock fixtures while backend integration is being developed.

**Exit gate:** The complete gameplay flow works with deterministic mock data.

## Phase 3: Gemini Integration

- Add the Gemini service.
- Create versioned prompts.
- Define structured schemas.
- Implement staged generation.
- Validate output.
- Add bounded repair and retry logic.

**Exit gate:** A real Gemini response can become a validated internal case.

## Phase 4: Database and API

- Implement Mongoose schemas.
- Implement case persistence.
- Implement status polling.
- Implement public response serializers.
- Implement evidence and suspect endpoints.
- Implement accusation evaluation.

**Exit gate:** The UI can play a persisted case through the actual backend.

## Phase 5: Evidence Media

- Implement chat evidence rendering.
- Implement image evidence rendering.
- Implement the simulated CCTV viewer.
- Add optional media provider integration if configured.
- Add media fallbacks and status reporting.

**Exit gate:** Each evidence type has truthful, functional rendering behavior.

## Phase 6: Logic and Security

- Implement solvability checks.
- Verify solution secrecy.
- Add rate limiting.
- Add cost and concurrency controls.
- Add error recovery.
- Add security tests.

**Exit gate:** Critical invariants pass automated tests.

## Phase 7: Final Verification

- Run linting.
- Run unit and integration tests.
- Run a complete end-to-end flow.
- Verify responsive layouts.
- Test failure cases.
- Update README.
- Document outstanding limitations.

**Exit gate:** All mandatory acceptance criteria pass, and any remaining limitations are documented.

---

# 19. SPEC-DRIVEN DEVELOPMENT RULES FOR CODEX

These rules are mandatory for all implementation work.

1. `SPEC.md` is the authoritative source of truth.
2. Read the entire specification before modifying the project.
3. Inspect the existing repository before creating or replacing files.
4. Preserve existing working functionality unless a change is required by this specification.
5. Do not silently change product requirements, API contracts, schemas, or architecture.
6. If requirements conflict, identify the conflict and propose the smallest resolution before making a consequential change.
7. Implement in phases and satisfy each phase's exit gate before moving forward.
8. Maintain a requirements-to-tests mapping.
9. Every mandatory functional requirement must have an implementation or an explicitly documented blocker.
10. Every critical backend invariant must have an automated test.
11. Use shared schemas and validators where appropriate to prevent contract drift.
12. Never invent successful API responses, completed generations, or real media assets.
13. Do not use hardcoded mock data in production workflows.
14. Mock data is permitted in tests and clearly labeled development previews.
15. Do not hardcode secrets, provider credentials, or environment-specific URLs.
16. Do not expose private solution fields to the frontend.
17. Never allow a language model to override the stored culprit during accusation evaluation.
18. Do not add unnecessary frameworks or dependencies.
19. Use the smallest maintainable implementation that satisfies the requirements.
20. Keep the README and environment example synchronized with the implementation.
21. Run the relevant tests after each meaningful change.
22. Do not claim tests passed unless they were actually executed and passed.
23. When a feature cannot be implemented with the configured providers, document the limitation and implement the specified fallback.
24. Update this specification only when an explicit product decision changes a requirement.

## Required project tracking files

Maintain:

- `SPEC.md` — authoritative product and engineering requirements.
- `IMPLEMENTATION_PLAN.md` — current phase, tasks, dependencies, and blockers.
- `REQUIREMENTS_TRACEABILITY.md` — mapping of requirements to implementation files and tests.
- `DECISIONS.md` — approved architectural and product decisions.
- `README.md` — installation and operation instructions.

Do not create contradictory copies of requirements in multiple documents. Other documents must refer to `SPEC.md` as the source of truth.

---

# 20. DEFINITION OF DONE

The project is not complete simply because the landing page looks good.

The MVP is complete when:

- The application starts correctly.
- A user can submit a scenario.
- Gemini generates a coherent mystery.
- The backend validates the mystery.
- The case is persisted.
- The player can inspect the generated suspects and evidence.
- The timeline and evidence references are consistent.
- The culprit remains secret until the player submits an accusation.
- The backend evaluates the accusation correctly.
- The player receives a reasoned solution reveal.
- Failure states are handled.
- Critical security and consistency tests pass.
- The complete flow is documented and verified.

**Final product objective:** Deliver a playable, reliable AI-powered detective experience in which the mystery is generated dynamically, the evidence tells a coherent story, and the player's conclusion is evaluated against a fixed, defensible solution.

**End of specification.**