export const getJSDateFromStr = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return new Date(+year, +month - 1, +day);
};
