export const getMonthDiff = (start: Date, end: Date): number => {
  const monthsStart = start.getMonth() + (start.getFullYear() * 12);
  const monthsEnd = end.getMonth() + (end.getFullYear() * 12);
  return monthsEnd - monthsStart;
};
