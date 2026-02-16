export const NIGHT_DURATION = 90 + 89 * 5;

export const getHour = (time: number) => {
  if (time < 90) return "12AM";
  if (time < 90 + 89 * 1) return "1AM";
  if (time < 90 + 89 * 2) return "2AM";
  if (time < 90 + 89 * 3) return "3AM";
  if (time < 90 + 89 * 4) return "4AM";
  if (time < 90 + 89 * 5) return "5AM";
  return "6AM";
};
