export const getMonthDiff = (start: Date, end: Date): number => {
  const monthsStart = start.getMonth() + (start.getFullYear() * 12);
  const monthsEnd = end.getMonth() + (end.getFullYear() * 12);
  return monthsEnd - monthsStart;
};

export const mockDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
