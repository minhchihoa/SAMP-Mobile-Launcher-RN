export const compareVersions = (v1: string, v2: string): number => {
  if (!v1) v1 = "0.0.0";
  if (!v2) v2 = "0.0.0";
  
  const v1Parts = v1.trim().split('.').map(Number);
  const v2Parts = v2.trim().split('.').map(Number);
  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = v1Parts[i] || 0;
    const num2 = v2Parts[i] || 0;

    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};
