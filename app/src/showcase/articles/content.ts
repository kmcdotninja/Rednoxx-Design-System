import type { Article } from './types'

/**
 * Content — how the product is written. Copy is a clinical surface here: a
 * badly worded allergy override is an incident, not a UX papercut, which is
 * why this sits at the top level beside Components and Patterns.
 */
export const CONTENT_ARTICLES: Article[] = [
  {
    slug: 'overview',
    title: 'Overview',
    summary:
      'Writing for Rednoxx. Copy is part of the safety surface — these rules are held to the same standard as the components.',
    blocks: [
      {
        kind: 'p',
        text: 'A clinician reads an interface under time pressure, often on a tablet, often mid-conversation with a patient. Words in that context are load-bearing: an ambiguous unit, a vague confirmation verb or an abbreviation that means two things is a clinical risk, not a tone-of-voice preference.',
      },
      { kind: 'h', text: 'The three tests' },
      {
        kind: 'steps',
        items: [
          'Could this be misread under pressure? Ambiguity is the enemy, not formality.',
          'Does it say what will happen, in the user’s words? Not what the system will do, in ours.',
          'If it conveys status, does the word carry the meaning without the colour?',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Two pages here are safety controls',
        text: 'Do-not-use abbreviations and Punctuation & numerals encode the highest-yield typographic controls in medication safety. Treat them as hard rules.',
      },
    ],
  },
  {
    slug: 'voice-and-tone',
    title: 'Voice & tone',
    summary: 'Clear, calm, and specific. Never chatty, never cold.',
    blocks: [
      { kind: 'h', text: 'Voice — constant' },
      {
        kind: 'list',
        items: [
          'Plain clinical register: precise without jargon-for-jargon’s-sake.',
          'Direct address — “you”, active voice, present tense.',
          'Specific over general: “2 unsent orders” beats “unsaved changes”.',
        ],
      },
      { kind: 'h', text: 'Tone — varies by stakes' },
      {
        kind: 'table',
        head: ['Situation', 'Tone', 'Example'],
        rows: [
          ['Routine', 'Neutral, brief', 'Vitals saved.'],
          ['Recoverable error', 'Helpful, non-blaming', 'That date is in the future. Enter a date of birth on or before today.'],
          ['Safety warning', 'Direct, unhedged', 'Amina Bello has a recorded penicillin allergy.'],
          ['Irreversible action', 'Explicit about consequence', 'Merging cannot be undone from this screen and will be recorded in the audit log.'],
        ],
      },
      {
        kind: 'dodont',
        do: ['“Order sent to pharmacy.”', '“You have 2 unsent orders for Amina Bello.”'],
        dont: ['“Oops! Something went wrong 😕”', '“Operation completed successfully.”'],
      },
    ],
  },
  {
    slug: 'capitalization',
    title: 'Capitalization',
    summary: 'Sentence case everywhere, with a short list of exceptions.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Sentence case for every UI string: buttons, labels, headings, menu items, table headers, toasts.',
          'Capitalise proper nouns, drug brand names, and named standards (FHIR, SNOMED CT, LOINC, ICD-10).',
          'Generic drug names stay lower case: paracetamol, not Paracetamol.',
          'Never use ALL CAPS for emphasis — it reads as shouting and degrades scanning. Use weight.',
        ],
      },
      {
        kind: 'dodont',
        do: ['Save changes', 'Lab orders', 'Release of information'],
        dont: ['Save Changes', 'Lab Orders', 'RELEASE OF INFORMATION'],
      },
    ],
  },
  {
    slug: 'numerals',
    title: 'Punctuation & numerals',
    summary:
      'The typographic rules that prevent tenfold dosing errors. These are not style preferences.',
    blocks: [
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Leading and trailing zeros',
        text: 'Always write a leading zero (0.5 mg). Never write a trailing zero (5 mg, not 5.0 mg). A missed decimal point in either direction is a tenfold dosing error — this is the single highest-yield typographic control in medication safety.',
      },
      { kind: 'h', text: 'Numbers' },
      {
        kind: 'table',
        head: ['Rule', 'Write', 'Not'],
        rows: [
          ['Leading zero required', '0.5 mg', '.5 mg'],
          ['No trailing zero', '5 mg', '5.0 mg'],
          ['Space before unit', '5 mg', '5mg'],
          ['Numerals for all quantities', '3 doses', 'three doses'],
          ['Tabular figures for data', '1 240', '1,240 in a proportional font'],
        ],
      },
      { kind: 'h', text: 'Punctuation' },
      {
        kind: 'list',
        items: [
          'No full stop on labels, buttons, or single-sentence hints; full stops on multi-sentence body copy.',
          'No exclamation marks anywhere in clinical UI.',
          'Use an en dash for ranges with spaces around it in prose (2 – 4 hours) and no spaces in tabular data (2–4).',
          'Avoid the slash in clinical copy — “and/or” is ambiguous when read fast.',
        ],
      },
    ],
  },
  {
    slug: 'word-list',
    title: 'Word list',
    summary: 'The terms this product uses, and the ones it does not.',
    blocks: [
      {
        kind: 'table',
        head: ['Use', 'Not', 'Why'],
        rows: [
          ['patient', 'client, service user', 'Consistent with the clinical record and FHIR.'],
          ['encounter', 'visit, episode', 'Matches the FHIR resource the screen persists to.'],
          ['sign', 'authorise, approve (for clinical sign-off)', 'Distinguishes clinical sign-off from administrative approval.'],
          ['void', 'delete, cancel (for orders)', 'Orders are voided with an audit trail, never deleted.'],
          ['merge', 'combine, link', '“Merge” is the audited, reversible operation with a defined meaning.'],
          ['MRN', 'hospital number, file number', 'One identifier name across the product.'],
          ['facility', 'hospital, site, centre', 'Covers hospitals, clinics and health centres alike.'],
          ['record', 'chart, file', 'Reserve “chart” for the visualisation.'],
          ['log out', 'logout (as a verb), sign out', 'Verb is two words; the noun is not used in UI.'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'One name per concept',
        text: 'The cost of a synonym is not elegance — it is a clinician wondering whether “visit” and “encounter” are two different things. They are not, so only one appears.',
      },
    ],
  },
  {
    slug: 'do-not-use',
    title: 'Do-not-use abbreviations',
    summary:
      'Abbreviations that are prohibited in any clinical string — labels, hints, errors, printed output.',
    blocks: [
      {
        kind: 'callout',
        tone: 'danger',
        title: 'These are prohibited, not discouraged',
        text: 'Each entry below has a documented history of being misread as something else. Write the word out in full — in UI copy, in printed slips, and in anything a clinician reads to act on.',
      },
      {
        kind: 'table',
        head: ['Never write', 'Misread as', 'Write instead'],
        rows: [
          ['U, u', 'the digit 0 or 4, or “cc”', 'unit'],
          ['IU', 'IV, or the digit 10', 'international unit'],
          ['QD, Q.D.', 'QID (four times daily)', 'daily'],
          ['QOD, Q.O.D.', 'QD (daily) or QID', 'every other day'],
          ['MS, MSO₄, MgSO₄', 'morphine vs magnesium sulfate — confused for each other', 'morphine sulfate / magnesium sulfate'],
          ['µg', 'mg — a thousandfold error', 'mcg'],
          ['cc', 'the digit 00, or “u”', 'mL'],
          ['@', 'the digit 2', 'at'],
          ['D/C', 'discharge vs discontinue', 'discharge / discontinue'],
        ],
      },
      { kind: 'h', text: 'Also avoid' },
      {
        kind: 'list',
        items: [
          'Any abbreviation of a drug name — write the generic name in full.',
          'Apothecary units — use metric.',
          'Bare “SC” or “SQ” for subcutaneous — write it out.',
        ],
      },
    ],
  },
  {
    slug: 'units',
    title: 'Units & dose expressions',
    summary: 'Units are rendered by the UI, never typed by the user.',
    blocks: [
      {
        kind: 'p',
        text: 'A free-text field that accepts “5mg” is a defect. The unit is UI chrome beside the input, so it cannot be mistyped, mistranslated or omitted — and the stored value is unambiguous.',
      },
      { kind: 'h', text: 'Rendering' },
      {
        kind: 'table',
        head: ['Quantity', 'Render as'],
        rows: [
          ['Mass', '250 mg · 1.5 g · 500 mcg'],
          ['Volume', '10 mL · 1 L'],
          ['Weight', '62.5 kg'],
          ['Temperature', '38.4 °C'],
          ['Blood pressure', '128/84 mmHg'],
          ['Rate', '20 mL/hour'],
        ],
      },
      {
        kind: 'dodont',
        do: [
          'Show the unit beside the field as fixed chrome.',
          'Use mcg, never µg.',
          'Keep a space between value and unit.',
        ],
        dont: [
          'Let the user type the unit.',
          'Abbreviate frequency (“QD”) — write “daily”.',
          'Mix units within one column of a table.',
        ],
      },
    ],
  },
  {
    slug: 'patient-first',
    title: 'Patient-first language',
    summary: 'The person before the condition, everywhere a human reads it.',
    blocks: [
      {
        kind: 'dodont',
        do: [
          'patient with diabetes',
          'patient experiencing homelessness',
          'patient who uses a wheelchair',
          'patient declined the procedure',
        ],
        dont: [
          'diabetic',
          'homeless patient',
          'wheelchair-bound',
          'patient refused / non-compliant',
        ],
      },
      { kind: 'h', text: 'Why “declined”, not “refused”' },
      {
        kind: 'p',
        text: '“Refused” and “non-compliant” attribute fault and follow a patient through their record. “Declined” and “did not attend” describe the same event without the judgement, and are what the record should carry.',
      },
    ],
  },
  {
    slug: 'gender',
    title: 'Sex, gender & pronouns',
    summary: 'Two different fields, two different clinical purposes.',
    blocks: [
      {
        kind: 'table',
        head: ['Field', 'Purpose', 'Label'],
        rows: [
          ['Sex assigned at birth', 'Clinical calculations, reference ranges, screening', 'Sex assigned at birth'],
          ['Gender identity', 'How the patient is addressed and recorded socially', 'Gender identity'],
          ['Pronouns', 'How staff should refer to the patient', 'Pronouns'],
        ],
      },
      {
        kind: 'list',
        items: [
          'Never label a single field “Sex/Gender” — they drive different behaviour and conflating them produces both clinical and dignity errors.',
          'Where pronouns are recorded, surface them in the patient banner so staff see them before speaking.',
          'Default to they/them in any generated copy where the patient’s pronouns are unknown.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Reference ranges follow the clinical field',
        text: 'Observation flagging uses sex assigned at birth. Address and correspondence use gender identity and recorded pronouns.',
      },
    ],
  },
  {
    slug: 'accessible-writing',
    title: 'Writing for accessibility',
    summary: 'Copy that works when read aloud, magnified, or at speed.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Front-load the meaning — a screen-reader user hears the first words first.',
          'Link text describes the destination: “View lab result”, never “click here”.',
          'Never rely on position: “the button below” breaks in a reflowed 320px layout.',
          'Every colour-conveyed state also carries the word — “Critical”, not just a red chip.',
          'Icon-only controls carry an aria-label that matches their visible tooltip.',
          'Expand an abbreviation on first use in body copy; avoid it entirely in labels.',
        ],
      },
      {
        kind: 'dodont',
        do: ['View lab result', 'Critical — potassium 6.8 mmol/L'],
        dont: ['Click here', 'A red value with no label'],
      },
    ],
  },
  {
    slug: 'alert-copy',
    title: 'Alert & warning copy',
    summary: 'What an alert must say to be worth interrupting for.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'Name the patient — alerts appear beside decisions about a specific person.',
          'State the finding plainly: “has a recorded penicillin allergy”.',
          'State the conflict: what the clinician is about to do that collides with the finding.',
          'Offer the actions in plain verbs — “Change medication”, “Override with reason”.',
        ],
      },
      {
        kind: 'dodont',
        do: [
          '“Amina Bello has a recorded penicillin allergy. Amoxicillin is a penicillin-class antibiotic.”',
        ],
        dont: ['“Allergy conflict detected.”', '“Warning: interaction.”'],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'If it cannot say why, it should not interrupt',
        text: 'An alert that cannot state the specific finding and the specific conflict belongs inline, not in a modal.',
      },
    ],
  },
  {
    slug: 'error-messages',
    title: 'Error messages',
    summary: 'Say what happened, why, and what to do next — in that order.',
    blocks: [
      {
        kind: 'table',
        head: ['Situation', 'Write'],
        rows: [
          ['Invalid field', 'That date is in the future. Enter a date of birth on or before today.'],
          ['Missing required field', 'Enter the patient’s surname.'],
          ['Failed save', 'Could not save — the connection dropped. Your note is kept locally. Retry'],
          ['Permission', 'You do not have access to release records. Ask a HIM officer to complete this.'],
          ['Not found', 'No patient matches “Bello, A”. Check the spelling or search by MRN.'],
        ],
      },
      {
        kind: 'dodont',
        do: [
          'Name the field and the fix.',
          'Keep the user’s input.',
          'Offer the next action as a control, not a suggestion.',
        ],
        dont: [
          'Blame the user (“You entered an invalid value”).',
          'Show a code without a sentence.',
          'Clear the form on failure.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Long forms get a summary too',
        text: 'Inline errors alone are not enough on long forms. A top error summary with anchor links is required — see the Field and Error summary components.',
      },
    ],
  },
  {
    slug: 'empty-states',
    title: 'Empty states',
    summary: 'Three different empties, three different messages.',
    blocks: [
      {
        kind: 'table',
        head: ['Kind', 'Means', 'Say'],
        rows: [
          ['First use', 'Nothing exists yet', 'No orders yet. Orders you place appear here.'],
          ['No results', 'A filter or search excluded everything', 'No patients match “Bello, A”. Clear filters'],
          ['Cleared', 'The user finished the work', 'No pending results. You are up to date.'],
        ],
      },
      {
        kind: 'list',
        items: [
          'Never write a bare “No data”. It leaves the user unsure whether the system failed.',
          'A first-use empty state names the action that fills it; a no-results state offers the escape.',
          'A cleared state is allowed to be a small reward — it is the only place warmth belongs.',
        ],
      },
    ],
  },
  {
    slug: 'confirmation-copy',
    title: 'Confirmation copy',
    summary: 'The words on a destructive dialog carry the safety, not the colour.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Title states the action and the object: “Merge patient records”.',
          'Body restates the patient, states the consequence, and says whether it can be undone.',
          'Where irreversible, say “This will be recorded in the audit log.”',
          'The confirm button carries the explicit verb — “Merge records”, “Void order”. Never “OK”, “Yes”, or “Confirm”.',
          'Cancel is always literally “Cancel”.',
        ],
      },
      {
        kind: 'code',
        label: 'The shape',
        code: `Merge patient records

Amina Bello · MRN 004213 · 34F
will be merged into
Amina Bello · MRN 007781 · 34F

This cannot be undone from this screen and will be
recorded in the audit log.

[ I have verified these are the same patient ]

            Cancel     Merge records`,
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Never “Are you sure?”',
        text: '“Are you sure?” tests confidence, not comprehension. State the consequence and let the verb on the button carry the decision.',
      },
    ],
  },
]
