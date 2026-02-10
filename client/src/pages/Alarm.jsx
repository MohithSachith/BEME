import { triggerBemeAlarm } from "../utils/bemeAlarm";

useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const current = now.toTimeString().slice(0, 5);

    if (current === alarmTime) {
      triggerBemeAlarm(); // 🔔 HERE
    }
  }, 1000);

  return () => clearInterval(interval);
}, [alarmTime]);
