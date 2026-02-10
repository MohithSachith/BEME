let audio = null;

export function triggerBemeAlarm() {
  if (!audio) {
    audio = new Audio("/alarm.mp3");
    audio.loop = true;
  }
  audio.play();
}

export function stopBemeAlarm() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
