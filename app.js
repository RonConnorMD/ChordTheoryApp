// ===============================================================
// MUSIC THEORY APP — USER INTERFACE
//
// Handles the browser interface, user interactions, chord practice,
// quiz settings, feedback, and navigation.
//
// Music theory calculations are handled by musicTheory.js.
// ===============================================================

// ===============================================================
//    APPLICATION STATE
//
// Tracks the user's selections and the current quiz.
// ===============================================================

let selectedRoot = null;
let selectedChordType = null;
let currentQuestion = null;
let userAnswer = [];
let questionsAsked = 0;
let questionsCorrect = 0;
let selectedNotePoolDifficulty = "intermediate";

// ===============================================================
//    LEARN CHORDS — CHORD SELECTION AND DISPLAY
//
// Update the selected chord and control the Lookup button.
// ===============================================================

function updateLookupButton() {
  document.getElementById("lookupBtn").disabled = !(
    selectedRoot && selectedChordType
  );
}

function updateSelectedChordDisplay() {
  const display = document.getElementById("selectedChordDisplay");

  if (!selectedRoot || !selectedChordType) {
    display.textContent = "Select a root and chord type";
    return;
  }

  const symbol = chordSymbol(selectedRoot, selectedChordType);

  display.textContent = prettyMusic(symbol);
}

updateLookupButton();

// ===============================================================
//    PRACTICE SETTINGS — CHORD FILTER ACTIONS
//
// Select all chord types, clear all selections, or select core chords.
// ===============================================================

function selectAllChords() {
  document
    .querySelectorAll('#quizFilters input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = true;
    });
  document.querySelectorAll("#quizFilters details").forEach((group) => {
    group.open = true;
  });
}

function clearAllChords() {
  document
    .querySelectorAll('#quizFilters input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = false;
    });
}

function selectCoreChords() {
  document
    .querySelectorAll('#quizFilters input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = CORE_CHORDS.includes(cb.value);
    });
  document.querySelectorAll("#quizFilters details").forEach((group) => {
    const hasSelectedChord = group.querySelector(
      'input[type="checkbox"]:checked',
    );

    group.open = !!hasSelectedChord;
  });
}

// ===============================================================
//    EVENT LISTENERS — PRACTICE SETTINGS
//
// Connect filter action buttons and difficulty controls to their
// corresponding functions.
// ===============================================================

// Filter Action Buttons
document
  .getElementById("selectAllChordsBtn")
  .addEventListener("click", selectAllChords);

document
  .getElementById("clearAllChordsBtn")
  .addEventListener("click", clearAllChords);

document
  .getElementById("coreChordsBtn")
  .addEventListener("click", selectCoreChords);

// Difficulty Level Buttons
document.querySelectorAll(".difficulty-btn").forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.difficulty);
  });
});

// ===============================================================
//    PRACTICE CHORDS — INTERFACE
//
// Handle answer selection, scoring, and quiz feedback.
// ===============================================================
function updateScoreBoard() {
  const accuracy =
    questionsAsked === 0
      ? 0
      : Math.round((questionsCorrect / questionsAsked) * 100);

  document.getElementById("scoreBoard").textContent =
    `Score: ${questionsCorrect}/${questionsAsked} • ${accuracy}%`;
}

function setQuizNoteButtonsEnabled(enabled) {
  document.querySelectorAll("#quizNoteButtons button").forEach((button) => {
    button.disabled = !enabled;
  });
}

// ===============================================================
//    CORE CHORDS AND DISPLAY NAMES
//
// Define the chord types included in Core Chords mode and their
// labels in the user interface.
// ===============================================================
const CORE_CHORDS = [
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
];

const DISPLAY_NAMES = {
  major: "Major",
  minor: "Minor",
  diminished: "Dim",
  augmented: "Aug",
  sus2: "Sus2",
  sus4: "Sus4",
  add9: "Add9",
  major7: "Maj7",
  dominant7: "7",
  minor7: "m7",
  halfDiminished7: "ø7",
  diminished7: "dim7",
  major9: "Maj9",
  dominant9: "9",
  minor9: "m9",
  dominant7b9: "7♭9",
  dominant7sharp9: "7♯9",
};

// ===============================================================
//    PRACTICE SETTINGS — BUTTON REFERENCES
// ===============================================================
const selectAllBtn = document.getElementById("selectAllChords");
const clearAllBtn = document.getElementById("clearAllChords");
const coreChordsBtn = document.getElementById("coreChords");

// ===============================================================
//    LEARN CHORDS — ROOT SELECTION
//
// Create the root-note buttons and handle the user's selection.
// ===============================================================
const rootContainer = document.getElementById("rootButtons");

ROOTS.forEach((root) => {
  const button = document.createElement("button");

  button.textContent = root;

  button.addEventListener("click", function () {
    document
      .querySelectorAll("#rootButtons button")
      .forEach((btn) => btn.classList.remove("selected"));

    button.classList.add("selected");

    selectedRoot = root;

    updateLookupButton();
    updateSelectedChordDisplay();
  });

  rootContainer.appendChild(button);
});

// ===============================================================
//    LEARN CHORDS — CHORD TYPE SELECTION
//
// Create the chord-type buttons and handle the user's selection.
// ===============================================================
const chordContainer = document.getElementById("chordButtons");
[
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

  "halfDiminished7",
  "diminished7",

  "major9",
  "dominant9",
  "minor9",

  "dominant7b9",
  "dominant7sharp9",
].forEach((type) => {
  const button = document.createElement("button");

  button.textContent = DISPLAY_NAMES[type];

  button.addEventListener("click", function () {
    document
      .querySelectorAll("#chordButtons button")
      .forEach((btn) => btn.classList.remove("selected"));

    button.classList.add("selected");

    selectedChordType = type;

    updateLookupButton();
    updateSelectedChordDisplay();
  });

  chordContainer.appendChild(button);
});

// ===============================================================
//     LEARN CHORDS — CHORD LOOKUP
// ===============================================================
document.getElementById("lookupBtn").addEventListener("click", function () {
  const chord = buildChord(selectedRoot, selectedChordType);

  const notes = chordToString(chord);

  const prettyNotes = prettyMusic(notes);

  const symbol = chordSymbol(selectedRoot, selectedChordType);

  const prettySymbol = prettyMusic(symbol);

  const degrees = prettyMusic(chordDegrees(selectedChordType));

  const intervals = prettyMusic(chordIntervals(selectedChordType));

  document.getElementById("result").innerHTML = `
  <div class="info-card">
    <div class="card-title">Chord</div>
    <div class="card-value chord-symbol">${prettySymbol}</div>
  </div>

  <div class="info-card">
    <div class="card-title">Notes</div>
    <div class="card-value notes">${prettyNotes}</div>
  </div>

  <div class="info-card">
    <div class="card-title">Formula</div>
    <div class="card-value">${degrees}</div>
  </div>

  <div class="info-card">
    <div class="card-title">Intervals</div>
    <div class="card-value">${intervals}</div>
  </div>
  `;
});

// ===============================================================
//     PRACTICE CHORDS — SELECTED CHORD TYPES
//
// Return the chord types selected in Practice Settings.
// ===============================================================
function getSelectedChordTypes() {
  return [
    ...document.querySelectorAll(
      "#quizFilters input[type='checkbox'][value]:checked",
    ),
  ].map((checkbox) => checkbox.value);
}

// ===============================================================
//     PRACTICE CHORDS — DIFFICULTY SETTING
//
// Store the selected difficulty level.
// ===============================================================
let selectedDifficulty = "intermediate";

// ---------------------------------------------------------------
// Update the selected difficulty and button highlighting.
// ---------------------------------------------------------------

function setDifficulty(difficulty) {
  selectedDifficulty = difficulty;

  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.difficulty === difficulty);
  });
}

// ---------------------------------------------------------------
// Return the selected difficulty for the note pool.
// ---------------------------------------------------------------
function getSelectedNotePoolDifficulty() {
  return selectedDifficulty;
}

// ===============================================================
//     PRACTICE CHORDS — QUESTION GENERATION
//
// Select a random chord from the chosen roots and chord types,
// then generate its answer and available note pool.
// ===============================================================
function buildFilteredQuestion() {
  const selectedTypes = getSelectedChordTypes();
  const selectedRoots = getSelectedRoots();

  if (selectedTypes.length === 0) {
    alert("Please select at least one chord type.");
    return null;
  }

  if (selectedRoots.length === 0) {
    alert("Please select at least one root.");
    return null;
  }

  const root = randomItem(selectedRoots);

  const type = randomItem(selectedTypes);

  const answer = chordNotes(buildChord(root, type));

  const notePoolDifficulty = getSelectedNotePoolDifficulty();

  return {
    root,
    type,
    answer,
    notePool: getSmartNotePool(root, type, notePoolDifficulty),
  };
}

// ===============================================================
//     PRACTICE CHORDS — NEW QUESTION
//
// Initialize a new question, reset the answer selection, and
// display the chord to identify.
// ===============================================================
document
  .getElementById("newQuestionBtn")
  .addEventListener("click", function () {
    currentQuestion = buildFilteredQuestion();
    if (!currentQuestion) {
      return;
    }
    document.getElementById("newQuestionBtn").style.display = "none";
    const q = currentQuestion;

    renderQuizNoteButtons();

    userAnswer = [];
    // Re-enable note buttons for new question
    document.querySelectorAll("#quizNoteButtons button").forEach((button) => {
      button.disabled = false;
    });

    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("checkAnswerBtn").disabled = true;
    displaySelectedNotes();

    document.getElementById("quizAnswer").textContent =
      "Enter " +
      q.answer.length +
      " notes • 0 of " +
      q.answer.length +
      " selected";

    document.getElementById("quizStatus").textContent = "";

    const answerCount = q.answer.length;

    const displayChord = chordSymbol(q.root, q.type);

    document.getElementById("quizQuestion").textContent =
      prettyMusic(displayChord);

    document.getElementById("quizAnswer").textContent =
      "Enter " + answerCount + " notes";
  });

// ===============================================================
//     PRACTICE CHORDS — NOTE BUTTONS
//
// Create note buttons from the available note pool and handle
// the user's answer selection.
// ===============================================================

function renderQuizNoteButtons() {
  const quizNoteContainer = document.getElementById("quizNoteButtons");

  quizNoteContainer.innerHTML = "";

  if (!currentQuestion) {
    return;
  }

  currentQuestion.notePool.forEach((note) => {
    const button = document.createElement("button");

    button.textContent = prettyMusic(note);

    button.addEventListener("click", function () {
      if (userAnswer.length >= currentQuestion.answer.length) {
        return;
      }

      userAnswer.push(note);

      displaySelectedNotes();

      document.getElementById("quizAnswer").textContent =
        "Enter " +
        currentQuestion.answer.length +
        " notes • " +
        userAnswer.length +
        " of " +
        currentQuestion.answer.length +
        " selected";

      if (userAnswer.length === currentQuestion.answer.length) {
        document.getElementById("checkAnswerBtn").disabled = false;

        setQuizNoteButtonsEnabled(false);
      }
    });

    quizNoteContainer.appendChild(button);
  });
}

// ===============================================================
//     PRACTICE CHORDS — CHECK ANSWER
//
// Evaluate the selected notes, update the score, and display
// feedback showing whether the answer is correct.
// ===============================================================
document
  .getElementById("checkAnswerBtn")
  .addEventListener("click", function () {
    const correct = checkAnswer(currentQuestion.answer, userAnswer);
    questionsAsked++;
    if (correct) {
      questionsCorrect++;
      audioManager.playAnswerSound(true);

      const displayChord = prettyMusic(
        chordSymbol(currentQuestion.root, currentQuestion.type),
      );

      document.getElementById("quizFeedback").innerHTML = `
  <div class="feedback-card feedback-correct">
  <div class="feedback-title">
    ✅ Correct! ${displayChord}
  </div>

  <button class="feedback-next-btn">
    Next Question
  </button>
</div>

  `;

      document
        .querySelector(".feedback-next-btn")
        ?.addEventListener("click", () => {
          document.getElementById("newQuestionBtn").click();
        });

      document.getElementById("checkAnswerBtn").disabled = true;

      updateScoreBoard();
    } else {
      audioManager.playAnswerSound(false);
      const analysis = getChordAnalysis(
        currentQuestion.root,
        currentQuestion.type,
      );
      document.getElementById("quizFeedback").innerHTML = `
    <div class="feedback-card feedback-incorrect">
      <div class="feedback-title">❌ Incorrect</div>

      <div class="answer-row">
  <strong>Your Answer:</strong>
  ${prettyMusic(userAnswer.join(" "))}

  &nbsp;&nbsp;|&nbsp;&nbsp;

  <strong>Correct Answer:</strong>
  ${prettyMusic(currentQuestion.answer.join(" "))}
</div>
      <hr>
<div>
 
<div class="formula-heading">
  <strong>${prettyMusic(analysis.chord)} is comprised of:</strong>
</div>

<div class="formula-pills">
  ${analysis.formula
    .split(" ")
    .map((degree) => `<span class="degree-pill">${prettyMusic(degree)}</span>`)
    .join("")}
  </div>
</div>
<br>
<div>
  <strong>Intervals:</strong>
  ${analysis.intervals.map((interval) => prettyMusic(interval)).join(" • ")}
</div>

<div class="feedback-actions">
  <button class="feedback-next-btn">
    Next Question
  </button>
</div>

   `;

      document
        .querySelector(".feedback-next-btn")
        ?.addEventListener("click", () => {
          document.getElementById("newQuestionBtn").click();
        });

      document.getElementById("checkAnswerBtn").disabled = true;

      updateScoreBoard();
    }
  });

// ===============================================================
//     PRACTICE CHORDS — DIFFICULTY HELP
//     Show or hide the explanation of the difficulty levels.
// ===============================================================
const difficultyInfoBtn = document.getElementById("difficultyInfoBtn");
const difficultyInfo = document.getElementById("difficultyInfo");
difficultyInfoBtn.addEventListener("click", () => {
  difficultyInfo.hidden = !difficultyInfo.hidden;
});

// =======================================================================
//     PRACTICE CHORDS — NEXT QUESTION
//     Generate a new question and reset the answer-selection interface.
// =======================================================================

document

  .getElementById("nextQuestionBtn")

  .addEventListener("click", function () {
    currentQuestion = buildFilteredQuestion();

    if (!currentQuestion) {
      return;
    }

    const q = currentQuestion;

    renderQuizNoteButtons();

    userAnswer = [];

    displaySelectedNotes();

    document.getElementById("quizFeedback").innerHTML = "";

    document.getElementById("nextQuestionContainer").style.display = "none";

    document.getElementById("checkAnswerBtn").disabled = true;

    document.getElementById("quizQuestion").innerHTML = prettyMusic(
      chordSymbol(q.root, q.type),
    );

    document.getElementById("quizAnswer").textContent =
      `Enter ${q.answer.length} notes • 0 of ${q.answer.length} selected`;

    document.getElementById("quizStatus").textContent = "";
  });

// ===============================================================
//     PRACTICE CHORDS — CLEAR ANSWER
//     Clear the selected notes and allow the user to try again.
// ===============================================================
document
  .getElementById("clearAnswerBtn")
  .addEventListener("click", function () {
    userAnswer = [];
    setQuizNoteButtonsEnabled(true);
    displaySelectedNotes();

    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("checkAnswerBtn").disabled = true;
  });

// ===============================================================
//     PRACTICE CHORDS — SELECTED ROOTS
//     Return the root notes selected in Practice Settings.
// ===============================================================

function getSelectedRoots() {
  const selectedRoots = [];

  document;
  document
    .querySelectorAll("#rootFilters input[type='checkbox'][value]")
    .forEach(function (checkbox) {
      if (checkbox.checked && checkbox.value) {
        selectedRoots.push(checkbox.value);
      }
    });

  return selectedRoots;
}

// ===============================================================
//     PRACTICE CHORDS — SELECTED NOTES DISPLAY
//     Display the notes the user has selected for the current answer.
// ===============================================================

function displaySelectedNotes() {
  const container = document.getElementById("selectedNotes");

  container.innerHTML = "";

  userAnswer.forEach(function (note) {
    const span = document.createElement("span");

    span.className = "note-pill";

    span.textContent = prettyMusic(note);

    container.appendChild(span);
  });
}

// ===============================================================
//  PRACTICE SETTINGS — CHORD TYPE GROUPS
//
// Keep group checkboxes synchronized with their individual chord
// type selections.
// ===============================================================
function setupGroupCheckbox(groupId, memberClass) {
  const groupCheckbox = document.getElementById(groupId);

  const members = document.querySelectorAll("." + memberClass);

  // Selecting a group selects or clears all its chord types.

  groupCheckbox.addEventListener("change", function () {
    members.forEach(function (member) {
      member.checked = groupCheckbox.checked;
    });
  });

  // Update the group checkbox when individual selections change.

  members.forEach(function (member) {
    member.addEventListener("change", function () {
      const allChecked = [...members].every((checkbox) => checkbox.checked);

      groupCheckbox.checked = allChecked;
    });
  });
}
// ===============================================================
// PRACTICE SETTINGS — CHORD TYPE GROUPS
//
// Connect each chord-type group checkbox to its member checkboxes.
// ===============================================================
setupGroupCheckbox("triadsGroup", "triadChord");

setupGroupCheckbox("suspendedGroup", "suspendedChord");

setupGroupCheckbox("seventhGroup", "seventhChord");

setupGroupCheckbox("ninthGroup", "ninthChord");

// ===============================================================
// PRACTICE SETTINGS — ROOT GROUPS
//
// Connect the natural, sharp, and flat root group checkboxes
// to their individual root selections.
// ===============================================================
setupGroupCheckbox("naturalRootsGroup", "naturalRoot");
setupGroupCheckbox("sharpRootsGroup", "sharpRoot");
setupGroupCheckbox("flatRootsGroup", "flatRoot");

// ===============================================================
//   APP NAVIGATION
//     Control movement between the home screen and app sections.
// ===============================================================
const homeScreen = document.getElementById("homeScreen");

const builderSection = document.getElementById("builderSection");

const quizSection = document.getElementById("quizSection");

const appHeader = document.querySelector(".app-header");

// ===============================================================
//   APP NAVIGATION — LEARN CHORDS
//     The home-screen button labeled "Learn Chords" uses the ID
//     showBuilderBtn.
// ===============================================================
document
  .getElementById("showBuilderBtn")
  .addEventListener("click", function () {
    homeScreen.style.display = "none";
    builderSection.style.display = "block";
    quizSection.style.display = "none";

    appHeader.style.display = "none";

    builderSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

// ===============================================================
// APP NAVIGATION — PRACTICE CHORDS
//     The home-screen button labeled "Practice Chords" uses the ID
//     showQuizBtn.
// ===============================================================
document.getElementById("showQuizBtn").addEventListener("click", function () {
  audioManager.stopMusic();
  homeScreen.style.display = "none";
  builderSection.style.display = "none";
  quizSection.style.display = "block";

  appHeader.style.display = "none";

  quizSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// ===============================================================
// APP NAVIGATION — LEARN PROGRESSIONS
// ===============================================================
document
  .getElementById("learnProgressionsHomeBtn")
  .addEventListener("click", function () {
    audioManager.stopMusic();
    homeScreen.style.display = "none";
    builderSection.style.display = "none";
    quizSection.style.display = "none";
    appHeader.style.display = "none";

    // Reset selections
    selectedProgressionKey = null;
    selectedProgression = null;

    // Clear selected button styling
    document
      .querySelectorAll(
        "#progressionKeyButtons button, #progressionButtons button",
      )
      .forEach((button) => {
        button.classList.remove("selected");
      });

    // Clear previous results
    document.getElementById("progressionResults").innerHTML = "";

    progressionsSection.style.display = "block";

    progressionsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

// ===============================================================
// LEARN PROGRESSIONS — KEY SELECTION
// ===============================================================
let selectedProgressionKey = null;
document.querySelectorAll("#progressionKeyButtons button").forEach((button) => {
  button.addEventListener("click", function () {
    selectedProgressionKey = this.dataset.key;

    document
      .querySelectorAll("#progressionKeyButtons button")
      .forEach((keyButton) => {
        keyButton.classList.remove("selected");
      });
    this.classList.add("selected");
    updateProgressionResults();
  });
});

// ===============================================================
// LEARN PROGRESSIONS — PROGRESSION SELECTION
// ===============================================================
let selectedProgression = null;
document.querySelectorAll("#progressionButtons button").forEach((button) => {
  button.addEventListener("click", function () {
    selectedProgression = this.dataset.progression;

    document
      .querySelectorAll("#progressionButtons button")
      .forEach((progressionButton) => {
        progressionButton.classList.remove("selected");
      });

    this.classList.add("selected");
    updateProgressionResults();
  });
});

// ===============================================================
// LEARN PROGRESSIONS — UPDATE RESULTS
// ===============================================================
function updateProgressionResults() {
  const results = document.getElementById("progressionResults");

  if (!selectedProgressionKey || !selectedProgression) {
    results.innerHTML = "";
    return;
  }

  const progression = CHORD_PROGRESSIONS[selectedProgression];
  const chords = buildChordProgression(
    selectedProgressionKey,
    selectedProgression,
  );

  results.innerHTML = `
    <h2>${prettyMusic(progression.name)}</h2>
    <p>${prettyMusic(chords.join(" – "))}</p>
  `;
}

// ===============================================================
// APP NAVIGATION — RETURN HOME FROM LEARN PROGRESSIONS
// ===============================================================
document
  .getElementById("progressionsHomeBtn")
  .addEventListener("click", function () {
    progressionsSection.style.display = "none";
    homeScreen.style.display = "block";
    appHeader.style.display = "block";
    if (audioManager.isSoundEnabled()) {
      audioManager.playBackgroundMusic();
    }

    homeScreen.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

// ===============================================================
// APP NAVIGATION — HOME BUTTONS
//     Return to the home screen from either app section.
// ===============================================================
document
  .getElementById("learnChordsHomeBtn")
  .addEventListener("click", showHome);

document
  .getElementById("practiceChordsHomeBtn")
  .addEventListener("click", showHome);

// ===============================================================
// APP NAVIGATION — RETURN HOME
//     Display the home screen and hide the other app sections.
// ===============================================================

function showHome() {
  homeScreen.style.display = "block";
  if (audioManager.isSoundEnabled()) {
    audioManager.playBackgroundMusic();
  }

  builderSection.style.display = "none";

  quizSection.style.display = "none";

  appHeader.style.display = "block";

  homeScreen.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// ===============================================================
// GLOBAL SOUND CONTROLS
// ===============================================================

document.getElementById("soundOnBtn").addEventListener("click", () => {
  audioManager.setSoundEnabled(true);

  if (homeScreen.style.display !== "none") {
    audioManager.playBackgroundMusic();
  }

  document.getElementById("soundOnBtn").classList.add("selected");
  document.getElementById("soundOffBtn").classList.remove("selected");

  document.getElementById("soundOnBtn").setAttribute("aria-pressed", "true");
  document.getElementById("soundOffBtn").setAttribute("aria-pressed", "false");
});

document.getElementById("soundOffBtn").addEventListener("click", () => {
  audioManager.setSoundEnabled(false);

  document.getElementById("soundOffBtn").classList.add("selected");
  document.getElementById("soundOnBtn").classList.remove("selected");

  document.getElementById("soundOffBtn").setAttribute("aria-pressed", "true");
  document.getElementById("soundOnBtn").setAttribute("aria-pressed", "false");
});
