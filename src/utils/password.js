/**
 * @file password.js
 * @description Password complexity requirements and strength validation utility.
 * Defines criteria list for password creation (length, uppercase, lowercase, special characters)
 * and exports strength checking validation function.
 */

/**
 * Array of individual validation criteria rules for password complexity.
 * Each criteria rule includes a unique ID, human-readable description label, and a boolean testing matcher function.
 */
export const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { id: "lowercase", label: "At least one lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
  { id: "number", label: "At least one number (0-9)", test: (pw) => /[0-9]/.test(pw) },
  { id: "special", label: "At least one special character (e.g., @$!%*?&)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

/**
 * Validates a password string against all requirements and computes a security strength score.
 * @param {string} password - The password string to check.
 * @returns {Object} Strength report containing score (0-5), isValid boolean, and verification results of each individual check.
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      isValid: false,
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      },
    };
  }

  const checks = {};
  let score = 0;

  passwordRequirements.forEach((req) => {
    const passed = req.test(password);
    checks[req.id] = passed;
    if (passed) score += 1;
  });

  return {
    score,
    isValid: score === passwordRequirements.length,
    checks,
  };
};
