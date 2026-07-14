const validateEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
}

export const EmailValidationUtils = {
  validateEmail,
}

/** @deprecated Use EmailValidationUtils.validateEmail instead. */
export { validateEmail }
