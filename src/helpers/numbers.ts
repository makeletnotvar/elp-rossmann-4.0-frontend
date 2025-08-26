export const limitDec = (num: number, dec: number): number => {
    const strNum = num.toString();
    const dotIndex = strNum.indexOf('.');

    return dotIndex > 0
        ? parseFloat(strNum.slice(0, dotIndex + dec + 1))
        : num;
}