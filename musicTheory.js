// ===============================================================
// MUSIC THEORY ENGINE
//
// Core music theory functions shared by the application.
// Includes chord definitions, note spelling, chord construction,
// music notation, and quiz logic.
//
// This file contains music theory logic, not browser UI code.
// ===============================================================

// ===============================================================
//    CONSTANTS AND MUSICAL DEFINITIONS
// ===============================================================

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

// ===============================================================
// NATURAL PITCHES
// Uses C = 0, with pitch values measured in semitones.
// ===============================================================
const NATURAL_PITCHES = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

// ===============================================================
//    CHORD DEFINITIONS
//
// Defines the semitone distances, note-letter steps, scale degrees,
// and interval names for each supported chord type.
// ===============================================================
const CHORDS = {
  major: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
  ],

  minor: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
  ],

  diminished: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 6, letterSteps: 4, degree: "b5", interval: "Diminished 5th" },
  ],

  augmented: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 8, letterSteps: 4, degree: "#5", interval: "Augmented 5th" },
  ],

  sus2: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 2, letterSteps: 1, degree: "2", interval: "Major 2nd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
  ],

  sus4: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 5, letterSteps: 3, degree: "4", interval: "Perfect 4th" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
  ],

  add9: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 14, letterSteps: 8, degree: "9", interval: "Major 9th" },
  ],

  major7: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 11, letterSteps: 6, degree: "7", interval: "Major 7th" },
  ],

  dominant7: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
  ],

  minor7: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
  ],

  major6: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 9, letterSteps: 5, degree: "6", interval: "Major 6th" },
  ],

  minor6: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 9, letterSteps: 5, degree: "6", interval: "Major 6th" },
  ],

  halfDiminished7: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 6, letterSteps: 4, degree: "b5", interval: "Diminished 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
  ],

  diminished7: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 6, letterSteps: 4, degree: "b5", interval: "Diminished 5th" },
    { semitones: 9, letterSteps: 6, degree: "bb7", interval: "Diminished 7th" },
  ],

  major9: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 11, letterSteps: 6, degree: "7", interval: "Major 7th" },
    { semitones: 14, letterSteps: 8, degree: "9", interval: "Major 9th" },
  ],

  dominant9: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
    { semitones: 14, letterSteps: 8, degree: "9", interval: "Major 9th" },
  ],

  minor9: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 3, letterSteps: 2, degree: "b3", interval: "Minor 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
    { semitones: 14, letterSteps: 8, degree: "9", interval: "Major 9th" },
  ],

  dominant7b9: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
    { semitones: 13, letterSteps: 8, degree: "b9", interval: "Flat 9th" },
  ],

  dominant7sharp9: [
    { semitones: 0, letterSteps: 0, degree: "1", interval: "Root" },
    { semitones: 4, letterSteps: 2, degree: "3", interval: "Major 3rd" },
    { semitones: 7, letterSteps: 4, degree: "5", interval: "Perfect 5th" },
    { semitones: 10, letterSteps: 6, degree: "b7", interval: "Minor 7th" },
    { semitones: 15, letterSteps: 8, degree: "#9", interval: "Sharp 9th" },
  ],
};
// ===============================================================
// End of chord definitions
// ===============================================================

// ===============================================================
//    CHORD SYMBOL DEFINITIONS
//
// Maps internal chord types to their standard chord symbols.
// Examples: minor7 → m7, dominant7 → 7, major7 → maj7.
// ===============================================================
const CHORD_SYMBOLS = {
  major: "",
  minor: "m",

  diminished: "dim",
  augmented: "aug",

  sus2: "sus2",
  sus4: "sus4",
  add9: "add9",

  major6: "6",
  minor6: "m6",

  major7: "maj7",
  dominant7: "7",
  minor7: "m7",

  halfDiminished7: "m7b5",
  diminished7: "dim7",

  major9: "maj9",
  dominant9: "9",
  minor9: "m9",

  dominant7b9: "7b9",
  dominant7sharp9: "7#9",
};

// ===============================================================
//    CHORD ROOTS
//
// All supported root-note spellings, including enharmonic pairs.
// ===============================================================

const ROOTS = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

// ===============================================================
// QUIZ NOTE POOL
//
// All note spellings that may appear as quiz answer choices.
// ===============================================================
const QUIZ_NOTES = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "E#",
  "Fb",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
  "B#",
  "Cb",
];

const CHORD_TYPES = Object.keys(CHORDS);

// ===============================================================
//    QUIZ CONFIGURATION
//
// Defines available chord types for each difficulty level.
// Beginner: major and minor chords.
// Intermediate: core triads, suspended chords, add9, and 7th chords.
// Advanced: all chord types defined in CHORDS.
// ===============================================================

const QUIZ_LEVELS = {
  beginner: ["major", "minor"],
  intermediate: [
    "major",
    "minor",
    "diminished",
    "augmented",

    "sus2",
    "sus4",
    "add9",

    "major7",
    "dominant7",
    "minor7",
  ],
  advanced: CHORD_TYPES,
};

// ===============================================================
// CURRENT QUIZ SELECTION
// ===============================================================

let currentChordTypes = QUIZ_LEVELS.advanced;

// ===============================================================
//    NOTE UTILITIES AND NOTE SPELLING
//
// Convert note names into structured data, calculate pitches,
// navigate note letters, and determine correct note spellings.
// ===============================================================

// ===============================================================
// Convert text to note object (parseNote function)
// ===============================================================
function parseNote(noteText) {
  const letter = noteText[0].toUpperCase();

  let accidental = 0;

  for (let i = 1; i < noteText.length; i++) {
    if (noteText[i] === "#") {
      accidental++;
    }

    if (noteText[i] === "b") {
      accidental--;
    }
  }

  return {
    letter: letter,
    accidental: accidental,
  };
}

// -----------------------------------------------------
// Convert Note object to text
// -----------------------------------------------------

function noteToString(note) {
  let accidentalText = "";

  if (note.accidental > 0) {
    accidentalText = "#".repeat(note.accidental);
  }

  if (note.accidental < 0) {
    accidentalText = "b".repeat(-note.accidental);
  }

  return note.letter + accidentalText;
}

// -----------------------------------------------------
// Move through musical alphabet
// -----------------------------------------------------

function nextLetter(letter, steps) {
  const index = LETTERS.indexOf(letter);

  return LETTERS[(index + steps) % 7];
}

// -----------------------------------------------------
// Natural pitch lookup
// -----------------------------------------------------

function naturalPitch(letter) {
  return NATURAL_PITCHES[letter];
}

//________________________________________________________
//  Find the pitch of a note
// _______________________________________________________
function pitchOf(note) {
  return (naturalPitch(note.letter) + note.accidental + 12) % 12;
}

// -----------------------------------------------------
// Determine accidental needed for a letter
// to reach a desired pitch
// -----------------------------------------------------

function accidentalNeeded(letter, desiredPitch) {
  const natural = naturalPitch(letter);

  let accidental = desiredPitch - natural;

  // Normalize to smallest distance

  if (accidental > 6) {
    accidental -= 12;
  }

  if (accidental < -6) {
    accidental += 12;
  }

  return accidental;
}

// -----------------------------------------------------
// Create a correctly spelled note
// from a letter and desired pitch
// -----------------------------------------------------

function spellNote(letter, desiredPitch) {
  return {
    letter: letter,
    accidental: accidentalNeeded(letter, desiredPitch),
  };
}

// ===============================================================
// buildChord - build a chord based on input provided
// ===============================================================
function buildChord(rootText, chordType) {
  const tones = CHORDS[chordType];

  const root = parseNote(rootText);

  const rootPitch = pitchOf(root);

  const chord = [];

  for (const tone of tones) {
    const desiredPitch = (rootPitch + tone.semitones) % 12;

    const desiredLetter = nextLetter(root.letter, tone.letterSteps);

    const note = spellNote(desiredLetter, desiredPitch);

    chord.push(note);
  }

  return chord;
}

// =====================================================
// Chord Analysis
// Returns all information needed to display
// a chord explanation anywhere in the app.
// Used by:
//   • Build a Chord
//   • Quiz feedback / teaching mode
// =====================================================

function getChordAnalysis(root, chordType) {
  const notes = buildChord(root, chordType);

  const formula = CHORDS[chordType].map((tone) => tone.degree).join(" ");

  const intervals = CHORDS[chordType].map((tone) => tone.interval);

  return {
    chord: chordSymbol(root, chordType),
    notes,
    formula,
    intervals,
  };
}

// ===============================================================
// Build Major Scale
// ===============================================================
function buildMajorScale(rootText) {
  const root = parseNote(rootText);

  const rootPitch = pitchOf(root);

  const intervals = [0, 2, 4, 5, 7, 9, 11];

  const scale = [];

  intervals.forEach((semitones, degree) => {
    const desiredPitch = (rootPitch + semitones) % 12;

    const desiredLetter = nextLetter(root.letter, degree);

    scale.push(spellNote(desiredLetter, desiredPitch));
  });

  return scale;
}

// ===============================================================
// Get Enharmonic Equivalents
// ===============================================================
function getEnharmonics(noteText) {
  const targetPitch = pitchOf(parseNote(noteText));

  return QUIZ_NOTES.filter((candidate) => {
    if (candidate === noteText) return false;

    return pitchOf(parseNote(candidate)) === targetPitch;
  });
}

// ===============================================================
//    QUIZ NOTE SELECTION UTILITIES
//
// Prepare and shuffle the note choices presented to the user.
// ===============================================================
// ===============================================================
//  Shuffle the answer choices
// ===============================================================
function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// ===============================================================
// Smart Note Pool
// ===============================================================

function getSmartNotePool(root, chordType, difficulty) {
  // Advanced = all notes
  if (difficulty === "advanced") {
    return shuffleArray([...QUIZ_NOTES]);
  }

  const pool = new Set();

  // Add chord tones
  chordNotes(buildChord(root, chordType)).forEach((note) => pool.add(note));

  // Add major scale notes
  chordNotes(buildMajorScale(root)).forEach((note) => pool.add(note));

  // Intermediate adds enharmonic equivalents
  if (difficulty === "intermediate") {
    const notesSoFar = [...pool];

    notesSoFar.forEach((note) => {
      getEnharmonics(note).forEach((enharmonic) => {
        pool.add(enharmonic);
      });
    });
  }

  return shuffleArray([...pool]);
}

// ===============================================================
// Chord Degree Display
// ===============================================================
function chordDegrees(chordType) {
  return CHORDS[chordType].map((tone) => tone.degree).join(" ");
}

// ===============================================================
// Chord Interval Display
// ===============================================================

function chordIntervals(chordType) {
  return CHORDS[chordType].map((tone) => tone.interval).join(", ");
}

// ===============================================================
// Chord to string
// ===============================================================
function chordToString(chord) {
  return chord.map(noteToString).join(" ");
}

// ===============================================================
// Chord Notes
// ===============================================================
function chordNotes(chord) {
  return chord.map(noteToString);
}

// ===============================================================
// Random Item Generator
// ===============================================================
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ===============================================================
// Build Question Object
// ===============================================================

function buildQuestion() {
  const root = randomItem(ROOTS);

  const type = randomItem(currentChordTypes);

  const answer = chordNotes(buildChord(root, type));

  return {
    root,

    type,

    answer,
  };
}

// ===============================================================
// Check Answer
// ===============================================================

function checkAnswer(correctAnswer, userAnswer) {
  if (correctAnswer.length !== userAnswer.length) {
    return false;
  }

  for (let i = 0; i < correctAnswer.length; i++) {
    if (correctAnswer[i] !== userAnswer[i]) {
      return false;
    }
  }

  return true;
}

// ===============================================================
// Normalize Note Text
// ===============================================================

function normalizeNoteText(noteText) {
  if (noteText.length === 0) {
    return noteText;
  }

  const letter = noteText[0].toUpperCase();

  const accidental = noteText.slice(1).toLowerCase();

  return letter + accidental;
}

// ===============================================================
// Parse User Answer
// ===============================================================

function parseAnswer(text) {
  return text.trim().split(/\s+/).map(normalizeNoteText);
}

// ===============================================================
// Parse Chord Name
// ===============================================================
function parseChordName(chordName) {
  chordName = chordName.trim();

  const match = chordName.match(/^([A-G][b#]?)(.*)$/);

  if (!match) {
    throw new Error("Invalid chord name");
  }

  const root = match[1];

  const suffix = match[2];

  const suffixMap = {
    "": "major",
    m: "minor",
    dim: "diminished",
    aug: "augmented",

    sus2: "sus2",
    sus4: "sus4",
    add9: "add9",

    maj7: "major7",
    7: "dominant7",
    m7: "minor7",
    m7b5: "halfDiminished7",
    dim7: "diminished7",

    maj9: "major9",
    9: "dominant9",
    m9: "minor9",

    "7b9": "dominant7b9",
    "7#9": "dominant7sharp9",
  };

  const type = suffixMap[suffix];

  if (!type) {
    throw new Error("Unknown chord type");
  }

  return {
    root: root,

    type: type,
  };
}

// ===============================================================
// Chord Symbol Display
// ===============================================================
function chordSymbol(root, chordType) {
  return root + CHORD_SYMBOLS[chordType];
}

// ===============================================================
// Pretty Music Display
// ===============================================================

function prettyMusic(text) {
  return text
    .replaceAll("bb", "♭♭")
    .replaceAll("##", "♯♯")
    .replaceAll("b", "♭")
    .replaceAll("#", "♯");
}

// ===============================================================
// CHORD PROGRESSIONS
// ===============================================================
const CHORD_PROGRESSIONS = {
  "I-IV-V-I": {
    name: "I – IV – V – I",
    description: "Fundamental major-key progression",
    chords: [
      { degree: 1, type: "major" },
      { degree: 4, type: "major" },
      { degree: 5, type: "major" },
      { degree: 1, type: "major" },
    ],
  },

  "I-V-vi-IV": {
    name: "I – V – vi – IV",
    description: "Extremely common in popular music",
    chords: [
      { degree: 1, type: "major" },
      { degree: 5, type: "major" },
      { degree: 6, type: "minor" },
      { degree: 4, type: "major" },
    ],
  },

  "I-vi-IV-V": {
    name: "I – vi – IV – V",
    description: "Classic pop progression",
    chords: [
      { degree: 1, type: "major" },
      { degree: 6, type: "minor" },
      { degree: 4, type: "major" },
      { degree: 5, type: "major" },
    ],
  },

  "ii-V-I": {
    name: "ii – V – I",
    description: "Fundamental jazz progression",
    chords: [
      { degree: 2, type: "minor" },
      { degree: 5, type: "major" },
      { degree: 1, type: "major" },
    ],
  },

  "I-IV-I-V": {
    name: "I – IV – I – V",
    description: "Familiar traditional and popular pattern",
    chords: [
      { degree: 1, type: "major" },
      { degree: 4, type: "major" },
      { degree: 1, type: "major" },
      { degree: 5, type: "major" },
    ],
  },
};

// ===============================================================
// Build Chord Progression
// ===============================================================
function buildChordProgression(key, progressionId, chordType = "triads") {
  const progression = CHORD_PROGRESSIONS[progressionId];

  if (!progression) {
    throw new Error("Unknown chord progression");
  }

  const majorScale = buildMajorScale(key);

  return progression.chords.map((chord) => {
    const root = noteToString(majorScale[chord.degree - 1]);

    let type = chord.type;

    if (chordType === "sevenths") {
      if (chord.type === "major") {
        type = chord.degree === 5 ? "dominant7" : "major7";
      } else if (chord.type === "minor") {
        type = "minor7";
      }
    }

    return chordSymbol(root, type);
  });
}
