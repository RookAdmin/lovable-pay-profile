
/**
 * Validates a UPI ID according to the format
 * @param upiId The UPI ID to validate
 * @returns boolean indicating if the UPI ID is valid
 */
export const validateUpiId = (upiId: string): boolean => {
  if (!upiId || typeof upiId !== 'string') return false;
  
  // UPI ID regex pattern: alphanumeric characters, dots, underscores, hyphens, followed by @ and 2-64 alphabetic characters
  const upiPattern = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;
  
  return upiPattern.test(upiId);
};
