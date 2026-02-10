export function triggerBemeAlarm() {
  // play alarm sound
  const audio = new Audio("/alarm.mp3");
  audio.loop = true;
  audio.play();

  // force navigation
  window.location.href = "/bemepro";

  // stop alarm after 30s safety
  setTimeout(() => audio.pause(), 30000);
}
