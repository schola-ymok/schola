export const isEmptyString = (str) => {
  return !str || !str.match(/\S/g);
};
