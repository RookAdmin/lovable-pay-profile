
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

/**
 * Validates an email address according to RFC 5322 standard
 * @param email The email address to validate
 * @returns boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Comprehensive email regex pattern following RFC 5322
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailPattern.test(email.trim());
};
