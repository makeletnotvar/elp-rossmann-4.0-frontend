export const getTimeFromTimestamp = (ts: number) => {
  return new Date(ts).toLocaleTimeString([], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/,\s?/g, " ");
};