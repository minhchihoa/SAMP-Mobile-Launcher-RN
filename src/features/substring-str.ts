export const substringStr = (str: string | any, legth: number) => {
  if (!str) {
    return '';
  }
  
  const stringValue = String(str);

  if (stringValue.length > legth) {
    return stringValue.substring(0, legth - 3) + '...';
  }

  return stringValue;
};
