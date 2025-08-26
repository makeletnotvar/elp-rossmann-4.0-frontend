/* eslint-disable no-useless-escape */
export const isValidImageFilePath = (filePath: string): boolean => {
    const pattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    return pattern.test(filePath);
};