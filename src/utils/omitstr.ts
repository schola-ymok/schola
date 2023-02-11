export const omitstr = (str, length, altStr) => {
  let len = 0;
  let cnt = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[ -~]/)) {
      len += 0.5;
    } else {
      len += 1;
    }
    if (len > length) {
      cnt = i;
      break;
    }
    if (i == str.length - 1) return str;
  }

  let omitStr = str?.substring(0, cnt);

  if (altStr) {
    omitStr += altStr;
  }

  return omitStr;
};
