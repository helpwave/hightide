'use client'

export const writeToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}