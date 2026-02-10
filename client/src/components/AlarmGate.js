export const isHabitActiveNow = (habit) => {
  if (!habit?.alarmBinding?.enabled) return false;
  if (!habit.alarmBinding.time) return false;

  const now = new Date();
  const [h, m] = habit.alarmBinding.time.split(":").map(Number);

  const alarm = new Date();
  alarm.setHours(h, m, 0, 0);

  const diffMinutes = (now - alarm) / 60000;
  return diffMinutes >= 0 && diffMinutes <= habit.alarmBinding.windowMinutes;
};

export const isHabitExpired = (habit) => {
  if (!habit?.alarmBinding?.enabled) return false;
  if (!habit.alarmBinding.time) return false;

  const now = new Date();
  const [h, m] = habit.alarmBinding.time.split(":").map(Number);

  const alarm = new Date();
  alarm.setHours(h, m, 0, 0);

  return (now - alarm) / 60000 > habit.alarmBinding.windowMinutes;
};
