export type FormError = {
  code: string,
  information?: unknown,
}

export type FormValidationResult = FormError | undefined
