// =========================================================
// AUDIO MANAGER
// Music Theory App
// =========================================================

const audioManager = (() => {
  // Background music files
  const backgroundSongs = [
    "alex-morgan-big-band-sunny-cafe-552776.mp3",
    "alex-morgan-bossa-nova-cafe-morning-breeze-573876.mp3",
    "alex-morgan-bossa-nova-sunny-cafe-552766.mp3",
    "alex-morgan-jazz-cocktail-bar-music-556247.mp3",
    "alex-morgan-samba-jazz-cocktail-bar-567546.mp3",
    "alex-morgan-samba-jazz-coffee-shop-567535.mp3",
    "alex-morgan-samba-jazz-midnight-club-567543.mp3",
    "alex-morgan-samba-jazz-sunny-cafe-567532.mp3",
    "alex-morgan-swing-jazz-coffee-shop-568165.mp3",
    "alex-morgan-vintage-jazz-coffee-shop-music-564249.mp3",
    "aurec-jazz-piano-585359.mp3",
    "openmindaudio-cartoon-classic-background-music-bright-journey-short-preview-497390.mp3",
  ];

  let currentMusic = null;
  let lastSongIndex = -1;
  let soundEnabled = true;

  // Select a random song, avoiding an immediate repeat
  function selectRandomSong() {
    let index;

    do {
      index = Math.floor(Math.random() * backgroundSongs.length);
    } while (backgroundSongs.length > 1 && index === lastSongIndex);

    lastSongIndex = index;
    return backgroundSongs[index];
  }

  // Stop background music
  function stopMusic() {
    if (currentMusic) {
      currentMusic.pause();
      currentMusic.currentTime = 0;
      currentMusic = null;
    }
  }

  // Play a randomly selected background song
  function playBackgroundMusic() {
    stopMusic();

    if (!soundEnabled) return;

    const song = selectRandomSong();

    currentMusic = new Audio(`Sounds/Songs/${song}`);
    currentMusic.volume = 0.3;

    currentMusic.play().catch((error) => {
      console.error("Unable to play background music:", error);
    });
  }

  // Turn all sound on or off
  function setSoundEnabled(enabled) {
    soundEnabled = enabled;

    if (!soundEnabled) {
      stopMusic();
    }
  }

  // Check whether sound is enabled
  function isSoundEnabled() {
    return soundEnabled;
  }

  // Play a correct or incorrect answer sound
  function playAnswerSound(isCorrect) {
    if (!soundEnabled) return;

    const correctSounds = [
      "applause 2.mp3",
      "Applause.mp3",
      "cartoon_music-bell-chime-correct-answer-489774.mp3",
      "cartoon_music-correct-answer-bells-499484.mp3",
      "cartoon_music-notification-correct-answer-504552.mp3",
      "cartoon_music-ui-negative-selection-512973.mp3",
      "dragon-studio-cartoon-blinking-372481.mp3",
      "dragon-studio-correct-472358.mp3",
      "dragon-studio-game-show-correct-tick-sound-416167.mp3",
      "driken5482-crowd-clapping-5-236778.mp3",
      "floraphonic-arcade-ui-2-229500.mp3",
      "freesound_community-correct-38597.mp3",
      "freesound_community-nailed-it-87033.mp3",
      "freesound_community-yipee-45360.mp3",
      "koiroylers-correct-356013.mp3",
      "mrstokes302-quotyupquot-male-voice-sfx-mrstokes302-428799.mp3",
      "u_a5z4rtk6yn-sonido-correcto-331225.mp3",
    ];

    const incorrectSounds = [
      "floraphonic-classic-game-action-negative-7-224415.mp3",
      "floraphonic-classic-game-action-negative-8-224414.mp3",
      "floraphonic-classic-game-action-negative-11-224411.mp3",
      "floraphonic-classic-game-action-negative-16-224586.mp3",
      "floraphonic-classic-game-action-negative-20-224577.mp3",
      "floraphonic-classic-game-action-negative-22-224585.mp3",
      "floraphonic-classic-game-action-negative-23-224575.mp3",
      "floraphonic-classic-game-action-negative-25-224584.mp3",
      "floraphonic-classic-game-action-negative-26-224583.mp3",
      "floraphonic-classic-game-action-negative-30-224581.mp3",
      "freesound_community-failure-drum-sound-effect-2-7184.mp3",
      "freesound_community-sadwhisle-91469.mp3",
      "mrstokes302-mm-mm-sfx-mrstokes302-548558.mp3",
      "mrstokes302-oops-sfx-mrstokes302-527192.mp3",
      "mrstokes302-quotnopequot-male-voice-sfx-mrstokes302-429188.mp3",
      "universfield-negative-notification-132470.mp3",
      "universfield-wrong-answer-129254.mp3",
    ];

    const folder = isCorrect ? "Correct" : "Incorrect";
    const sounds = isCorrect ? correctSounds : incorrectSounds;

    const soundFile = sounds[Math.floor(Math.random() * sounds.length)];

    const audio = new Audio(`Sounds/${folder}/${soundFile}`);
    audio.volume = 0.7;

    audio.play().catch((error) => {
      console.error("Unable to play answer sound:", error);
    });
  }

  // Public functions
  return {
    playBackgroundMusic,
    stopMusic,
    setSoundEnabled,
    isSoundEnabled,
    playAnswerSound,
  };
})();
