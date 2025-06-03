/**
 * The supported languages
 */
export const languages = ['en', 'de'] as const

/**
 * The supported languages
 */
export type Language = typeof languages[number]

/**
 * The supported languages' names in their respective language
 */
const languagesLocalNames: Record<Language, string> = {
    en: 'English',
    de: 'Deutsch',
}

/**
 * The default language
 */
const DEFAULT_LANGUAGE: Language = 'en'

/**
 * A constant definition for holding data regarding languages
 */
export const LanguageUtil = {
    DEFAULT_LANGUAGE,
    languagesLocalNames,
}