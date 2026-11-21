const difficultySettings = {
  EASY: { suspectCount: 3, evidenceCount: 6 },
  MEDIUM: { suspectCount: 4, evidenceCount: 10 },
  HARD: { suspectCount: 5, evidenceCount: 14 }
};

/**
 * A fully playable, deterministic case used only when every configured AI
 * provider is unavailable. It intentionally does not pretend to be generated
 * from the user's prompt; the UI labels it as a backup case.
 */
export function createPredefinedMystery(input) {
  const difficulty = difficultySettings[input.difficulty] ? input.difficulty : 'MEDIUM';
  const { suspectCount, evidenceCount } = difficultySettings[difficulty];
  const suspects = [
    {
      suspectId: 'suspect_01', name: 'Mara Vale', age: '38', role: 'Archive curator',
      relationship: 'Managed the museum archive and held authorized access to the restricted records room.',
      motive: 'She had secretly sold rare documents to cover a large personal debt and needed the original ledger to disappear.',
      alibi: 'She said she remained at the front desk throughout the evening, but the desk log was completed in one batch after closing.',
      suspiciousBehavior: 'She insisted the archive door had not been opened, although its access record showed a late entry.',
      publicFacts: ['Held an archive access card.', 'Knew the old service corridor.', 'Was responsible for the closing inventory.'],
      secret: 'She removed the ledger and hid it inside a false-bottom conservation case.'
    },
    {
      suspectId: 'suspect_02', name: 'Jonas Reed', age: '44', role: 'Security supervisor',
      relationship: 'Supervised the building security team and reviewed the night-shift recordings.',
      motive: 'He had argued with management after being blamed for a previous security lapse.',
      alibi: 'He said he was in the control room during the relevant period; the console activity log supports most of that account.',
      suspiciousBehavior: 'He delayed handing over the camera export and initially described the corridor camera as broken.',
      publicFacts: ['Could access the camera console.', 'Was on duty that evening.'],
      secret: 'He delayed the export because he was hiding an unrelated security-policy violation.'
    },
    {
      suspectId: 'suspect_03', name: 'Iris Bell', age: '31', role: 'Visiting researcher',
      relationship: 'Was cataloguing material for a temporary exhibition and had requested access to the ledger.',
      motive: 'She wanted to publish a discovery before a competing researcher.',
      alibi: 'She was in the reading room with two visitors; their checkout records and notes overlap with the critical time.',
      suspiciousBehavior: 'She asked several unusually specific questions about the ledger storage system.',
      publicFacts: ['Had requested to examine the ledger.', 'Was seen in the reading room after the archive closed.'],
      secret: 'She photographed a page earlier in the week but did not take the ledger.'
    },
    {
      suspectId: 'suspect_04', name: 'Theo Park', age: '27', role: 'Conservation assistant',
      relationship: 'Prepared display materials and moved sealed conservation cases between rooms.',
      motive: 'He feared a mistake in a restoration report would cost him his position.',
      alibi: 'He was in the preparation studio; the equipment sign-in and a colleague note support his timeline.',
      suspiciousBehavior: 'He carried an empty conservation case toward the archive shortly before closing.',
      publicFacts: ['Could handle conservation cases.', 'Had routine access to the preparation studio.'],
      secret: 'The case he carried was being returned for routine storage.'
    },
    {
      suspectId: 'suspect_05', name: 'Nadia Frost', age: '52', role: 'Museum director',
      relationship: 'Oversaw the archive and approved after-hours access requests.',
      motive: 'The ledger contained embarrassing records about a disputed acquisition.',
      alibi: 'She was at a public donor reception; guest photographs and the event schedule place her there.',
      suspiciousBehavior: 'She asked staff not to discuss the disputed acquisition with visitors.',
      publicFacts: ['Had authority to approve access.', 'Was present at the donor reception.'],
      secret: 'She wanted the acquisition records reviewed privately, but did not remove the ledger.'
    }
  ].slice(0, suspectCount);

  const start = new Date('2026-10-18T17:30:00.000Z');
  const events = [
    { eventId: 'event_01', timestamp: new Date(start), description: 'The archive ledger was checked into its locked cabinet before the evening exhibition began.', location: 'Museum archive', suspectIds: ['suspect_01', 'suspect_02'], evidenceIds: [] },
    { eventId: 'event_02', timestamp: new Date(start.getTime() + 45 * 60000), description: 'The security desk recorded a restricted-door access event after the public galleries had closed.', location: 'East archive corridor', suspectIds: ['suspect_01', 'suspect_02'], evidenceIds: [] },
    { eventId: 'event_03', timestamp: new Date(start.getTime() + 85 * 60000), description: 'A conservation case was moved from the preparation studio toward the archive passage.', location: 'Preparation studio', suspectIds: ['suspect_01', 'suspect_04'].filter((id) => suspects.some((person) => person.suspectId === id)), evidenceIds: [] },
    { eventId: 'event_04', timestamp: new Date(start.getTime() + 130 * 60000), description: 'The closing inventory found the ledger missing, while the cabinet lock showed no damage.', location: 'Museum archive', suspectIds: suspects.map((person) => person.suspectId), evidenceIds: [] }
  ];

  const evidenceTemplates = [
    ['DOCUMENT', 'Restricted-door access log', 'The electronic record shows Mara Vale’s archive card opened the east archive door at 6:15 PM.', 'Electronic access system', 'PRIMARY_CLUE', ['suspect_01'], 'The access system recorded Mara Vale’s card at 6:15 PM. The card was assigned to her alone, and no temporary transfer was registered.'],
    ['WITNESS_STATEMENT', 'The evening attendant’s statement', 'The attendant saw Mara return from the east corridor carrying a flat conservation case shortly after the access event.', 'Independent staff witness', 'PRIMARY_CLUE', ['suspect_01', 'suspect_04'], 'The attendant independently placed Mara near the archive with a case that could conceal a ledger. The statement was recorded before the access log was reviewed.'],
    ['CCTV', 'East corridor camera transcript', 'The simulated camera record shows a person entering the corridor during the restricted access window.', 'Simulated corridor camera transcript', 'SUPPORTING_CLUE', ['suspect_01'], 'FICTIONAL SIMULATION: A figure enters the corridor at 6:15 PM and leaves carrying a flat case. The face is not visible.'],
    ['DOCUMENT', 'Control-room export request', 'Jonas requested a delayed export of the corridor footage, citing a camera fault that the maintenance register does not list.', 'Security export register', 'RED_HERRING', ['suspect_02'], 'Jonas delayed the export to conceal an unrelated policy violation. The maintenance register shows the camera was operating.'],
    ['PHYSICAL', 'Conservation case lining', 'A loose fibre inside the returned case matches the protective wrap used around the missing ledger.', 'Conservation inspection', 'SUPPORTING_CLUE', ['suspect_01', 'suspect_04'], 'The returned case contained a strand of the ledger’s distinctive protective wrap, consistent with the witness account.'],
    ['DOCUMENT', 'Reading-room checkout sheet', 'Iris Bell’s reading-room checkout was recorded during the archive access window.', 'Reading-room register', 'SUPPORTING_CLUE', ['suspect_03'], 'The checkout sheet and visitor sign-out place Iris in the reading room during the critical period.'],
    ['CHAT', 'Message about the restoration report', 'Theo asked a colleague whether the conservation case had been returned to storage.', 'Fictional staff message archive', 'NEUTRAL', ['suspect_04'], 'The message concerns a routine storage return and does not place Theo inside the restricted archive.'],
    ['DOCUMENT', 'Donor reception schedule', 'The director’s scheduled appearance overlaps the time the ledger was removed.', 'Reception event schedule', 'SUPPORTING_CLUE', ['suspect_05'], 'The event schedule is corroborated by timestamped reception photographs.'],
    ['PHYSICAL', 'Undamaged cabinet lock', 'The cabinet lock has no scratches or signs of forced entry.', 'Archive cabinet inspection', 'SUPPORTING_CLUE', ['suspect_01'], 'The ledger was removed using authorized access rather than force, narrowing the opportunity to someone with a valid card.'],
    ['WITNESS_STATEMENT', 'Gallery visitor recollection', 'A visitor recalls seeing a staff member near the archive passage but cannot identify the person.', 'Visitor interview', 'NEUTRAL', ['suspect_01', 'suspect_02', 'suspect_04'], 'The recollection supports corridor activity but is not reliable enough to identify a suspect.'],
    ['DOCUMENT', 'Card assignment register', 'The archive card used at 6:15 PM was assigned to Mara and had not been reported missing.', 'Facilities card register', 'SUPPORTING_CLUE', ['suspect_01'], 'The assignment register confirms that the access log refers to Mara’s personal work card.'],
    ['CHAT', 'Research appointment confirmation', 'Iris confirmed her reading-room appointment and requested a copy of the public catalogue.', 'Fictional email archive', 'NEUTRAL', ['suspect_03'], 'The appointment confirmation supports the documented reason for Iris’s presence.'],
    ['DOCUMENT', 'Preparation studio sign-in', 'Theo’s equipment sign-in was recorded shortly before and after the corridor movement.', 'Workshop sign-in sheet', 'SUPPORTING_CLUE', ['suspect_04'], 'The sign-in sequence supports Theo’s account that he was returning equipment, not removing the ledger.'],
    ['PHYSICAL', 'Ledger storage impression', 'Dust outlines show the ledger was lifted cleanly from the cabinet without disturbing nearby volumes.', 'Archive inventory inspection', 'SUPPORTING_CLUE', ['suspect_01'], 'The clean removal is consistent with someone familiar with the cabinet layout and its contents.']
  ];

  const evidence = evidenceTemplates.slice(0, evidenceCount).map((entry, index) => {
    const event = events[index % events.length];
    const evidenceId = `evidence_${String(index + 1).padStart(2, '0')}`;
    event.evidenceIds.push(evidenceId);
    return {
      evidenceId, type: entry[0], title: entry[1], summary: entry[2], source: entry[3],
      clueRole: entry[4], suspectIds: entry[5].filter((id) => suspects.some((person) => person.suspectId === id)),
      eventIds: [event.eventId], reliability: entry[4] === 'PRIMARY_CLUE' ? 'High; independently recorded source' : 'Moderate; corroborate with other records',
      content: entry[6], timestamp: new Date(event.timestamp.getTime() + 5 * 60000),
      media: ['IMAGE', 'CCTV'].includes(entry[0]) ? { status: 'SIMULATED', caption: 'Fictional simulation; not real footage.', isSimulated: true } : { status: 'UNAVAILABLE', caption: '', isSimulated: true }
    };
  });

  const innocent = suspects.filter((person) => person.suspectId !== 'suspect_01').map((person) => ({
    suspectId: person.suspectId,
    reason: person.suspectId === 'suspect_02'
      ? 'His delayed footage export concealed a separate policy breach, but the access card was assigned to Mara and the independent witness saw her carrying the case.'
      : person.suspectId === 'suspect_03'
        ? 'The reading-room checkout and visitor records place her away from the archive during the restricted-door event.'
        : person.suspectId === 'suspect_04'
          ? 'The studio sign-in sequence supports his routine case return, while the archive card and independent witness point to Mara.'
          : 'The reception schedule and timestamped event photographs place her at the donor reception during the removal.'
  }));

  return {
    title: 'The Vanishing Clocktower Ledger',
    summary: `A ready-to-play backup mystery is being used because the AI providers are unavailable. This case is a prewritten museum-archive mystery and may not match your submitted scenario: ${String(input.scenario || '').slice(0, 160)}`,
    setting: 'A historic museum archive during an evening exhibition',
    suspects,
    events,
    evidence,
    solution: {
      culpritSuspectId: 'suspect_01',
      motive: 'Mara Vale had sold rare documents to cover a personal debt and needed the original ledger removed before its contents could be audited.',
      method: 'She used her assigned archive card to enter the east corridor, removed the ledger without damaging the cabinet, and concealed it inside a flat conservation case.',
      opportunity: 'The access log places her card at the restricted door, and an independent attendant saw her carrying a suitable case immediately afterward.',
      timelineExplanation: 'The ledger was present before closing. At 6:15 PM Mara’s assigned card opened the east archive door. Shortly afterward the attendant saw her carrying a flat conservation case. The closing inventory then found the ledger missing, while the lock remained undamaged. The access record and witness statement are independent and together establish access and opportunity.',
      decisiveEvidenceIds: ['evidence_01', 'evidence_02'],
      suspectExclusions: innocent,
      reasoningSummary: 'Mara Vale is the only suspect directly linked to both the restricted archive entry and the removal of a case capable of concealing the ledger. The electronic access log identifies her assigned card, while an independent witness places her carrying the case shortly afterward. The remaining suspicious details have separate explanations and do not overcome this evidence chain.'
    }
  };
}
