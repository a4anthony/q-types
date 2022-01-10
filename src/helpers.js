// import data from "./data";

export const setMicIndicator = (
  audioContext,
  stream,
  recording,
  props,
  volumeValues,
  audioQuality,
  emit,
  noAudio
) => {
  const analyser = audioContext.value.createAnalyser();
  const microphone = audioContext.value.createMediaStreamSource(stream);
  const javascriptNode = audioContext.value.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;
  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.value.destination);
  javascriptNode.onaudioprocess = function () {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    const length = array.length;
    for (let i = 0; i < length; i++) {
      values += array[i];
    }

    const average = values / length;
    if (recording.value) {
      colorPIds(
        Math.round(average),
        recording,
        props,
        volumeValues,
        audioQuality,
        emit,
        noAudio
      );
    }
  };
};

const colorPIds = (
  vol,
  recording,
  props,
  volumeValues,
  audioQuality,
  emit,
  noAudio
) => {
  let i;
  let allPIds = document.querySelectorAll(
    `.qt-pid${props.uniqueKey}_${props.uniqueString}`
  );
  let amountOfPIds = Math.round(vol / 10);
  if (recording.value) {
    volumeValues.value.push(amountOfPIds);
    setTimeout(() => {
      const volumeValuesLength = volumeValues.value.length;
      const volumeValuesLimit = Math.round(0.9 * volumeValues.value.length);
      const volumeValuesSorted = volumeValues.value.slice(
        volumeValuesLimit,
        volumeValuesLength
      );

      if (recording.value) {
        checkAudioQuality(
          volumeValuesSorted,
          audioQuality,
          props,
          emit,
          noAudio
        );
      }
    }, 100);
  }
  let elem_range = Array.from(allPIds).slice(0, amountOfPIds);
  for (i = 0; i < allPIds.length; i++) {
    allPIds[i].style.backgroundColor = "#e6e7e8";
  }
  for (i = 0; i < elem_range.length; i++) {
    elem_range[i].style.backgroundColor = "#69ce2b";
  }
};

const checkAudioQuality = (arr, audioQuality, props, emit, noAudio) => {
  const sum = function (array) {
    let total = 0;
    for (let i = 0; i < array.length; i++) {
      total += array[i];
    }
    return total;
  };

  const mean = function (array) {
    const arraySum = sum(array);
    return arraySum / array.length;
  };

  if (mean(arr) < 1) {
    audioQuality.value = "poor";
  }
  if (mean(arr) >= 1 && mean(arr) < 1.5) {
    audioQuality.value = "okay";
  }
  if (mean(arr) >= 1.5) {
    audioQuality.value = "good";
  }
  if (Math.max(...arr) < 1) {
    audioQuality.value = "poor";
  }
  if (audioQuality.value) {
    localStorage.setItem(props.lsConstant, audioQuality.value);
  }
  noAudio.value = arr.filter((x) => x !== 0).length === 0;
  emit("no-audio", noAudio.value);
};

export const unlockAudioContext = (audioCtx) => {
  if (audioCtx.state === "suspended") {
    const events = ["touchstart", "touchend", "mousedown", "keydown"];
    const unlock = function unlock() {
      events.forEach((event) => {
        document.body.removeEventListener(event, unlock);
      });
      // if (that.audioElm.src !== require('../../assets/sound_short.mp3').default) {
      console.log("unlock event called");
      audioCtx.resume();
      // }
    };

    events.forEach((event) => {
      document.body.addEventListener(event, unlock, false);
    });
  }
};
