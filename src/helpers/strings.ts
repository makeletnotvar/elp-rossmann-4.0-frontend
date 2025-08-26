export const getStringsCommonStartPart = (strings: string[]): string => {
  if (strings.length === 0) {
    return "";
  }

  let result = "";

  for (let i = 0; i < strings[0].length; i++) {
    const char: string = strings[0][i];

    if (strings.every((str) => str[i] === char)) {
      result += char;
    } else {
      return result;
    }
  }

  return result;
};

export const trimDash = (_str: string): string => {
  let str = _str.trim();
  if (str[str.length - 1] === "-") {
    str = str.slice(0, str.length - 1);
  }
  return str.trim();
};
