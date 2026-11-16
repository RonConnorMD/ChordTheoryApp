// Sample-based piano playback for Learn Chords.
// The app uses one medium-velocity layer of the VCSL Steinway B samples.
const pianoPlayer = (() => {
  const sampleFolder = "Sounds/Piano/VCSL-Steinway-B/";
  const sampleLayer = "v2";
  const minimumMidi = 60; // C4
  const maximumMidi = 83; // B5
  const highestSampleMidi = 82; // VCSL samples every whole tone, ending at A#5

  let audioContext = null;
  const sampleBuffers = new Map();
  let activeVoices = [];
  let playbackGeneration = 0;

  function getAudioContext() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("Web Audio is not supported in this browser.");
      }
      audioContext = new AudioContextClass();
    }
    return audioContext;
  }

  function sampleForMidi(midi) {
    return Math.min(highestSampleMidi, Math.round(midi / 2) * 2);
  }

  function loadSample(midi) {
    const sampleMidi = sampleForMidi(midi);
    if (!sampleBuffers.has(sampleMidi)) {
      const request = fetch(`${sampleFolder}${sampleMidi}_${sampleLayer}.m4a`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Piano sample request failed (${response.status}).`);
          }
          return response.arrayBuffer();
        })
        .then((data) => getAudioContext().decodeAudioData(data));
      sampleBuffers.set(sampleMidi, request);
    }
    return sampleBuffers.get(sampleMidi);
  }

  function stopActiveVoices() {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    activeVoices.forEach(({ source, gain }) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.025);
      try {
        source.stop(now + 0.12);
      } catch {
        // A voice that already ended does not need to be stopped again.
      }
    });
    activeVoices = [];
  }

  function stop() {
    playbackGeneration++;
    stopActiveVoices();
  }

  async function playChord(midiNotes) {
    if (!Array.isArray(midiNotes) || midiNotes.length === 0) {
      throw new Error("No chord notes were provided.");
    }

    const outOfRange = midiNotes.filter(
      (midi) => midi < minimumMidi || midi > maximumMidi,
    );
    if (outOfRange.length > 0) {
      const names = outOfRange.map((midi) => midiToName(midi)).join(", ");
      throw new RangeError(
        `${names} falls outside the current C4–B5 piano sample range.`,
      );
    }

    const requestGeneration = ++playbackGeneration;
    const context = getAudioContext();
    stopActiveVoices();
    await context.resume();
    const buffers = await Promise.all(midiNotes.map(loadSample));

    if (requestGeneration !== playbackGeneration) return false;
    const startAt = context.currentTime + 0.04;
    const noteGain = 0.72 / Math.sqrt(midiNotes.length / 3);

    midiNotes.forEach((midi, index) => {
      const source = context.createBufferSource();
      const gain = context.createGain();
      const sampleMidi = sampleForMidi(midi);
      source.buffer = buffers[index];
      source.playbackRate.value = Math.pow(2, (midi - sampleMidi) / 12);
      gain.gain.value = noteGain;
      source.connect(gain).connect(context.destination);
      source.start(startAt);
      activeVoices.push({ source, gain });
      source.onended = () => {
        activeVoices = activeVoices.filter((voice) => voice.source !== source);
      };
    });
    return true;
  }

  function midiToName(midi) {
    const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
  }

  return { playChord, stop };
})();
