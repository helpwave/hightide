import { useLanguage } from './LanguageProvider'
import type { Language } from './util'

/**
 * A type describing the pluralization of a word
 */
export type TranslationPlural = {
  zero?: string,
  one?: string,
  two?: string,
  few?: string,
  many?: string,
  other: string,
}

/**
 * The type describing all values of a translation
 */
export type TranslationType = Record<string, string | TranslationPlural>

/**
 * The type of translations
 */
export type Translation<T extends TranslationType> = Record<Language, T>

type OverwriteTranslationType<T extends TranslationType> = {
  language?: Language,
  translation?: Translation<Partial<T>>,
}

/**
 * Adds the `language` prop to the component props.
 *
 * @param Translation the type of the translation object
 *
 * @param Props the type of the component props, defaults to `Record<string, never>`,
 *              if you don't expect any other props other than `language` and get an
 *              error when using your component (because it uses `forwardRef` etc.)
 *              you can try out `Record<string, unknown>`, this might resolve your
 *              problem as `SomeType & never` is still `never` but `SomeType & unknown`
 *              is `SomeType` which means that adding back props (like `ref` etc.)
 *              works properly
 */
export type PropsForTranslation<
  Translation extends TranslationType,
  Props = Record<string, never>
> = Props & {
  overwriteTranslation?: OverwriteTranslationType<Translation>,
};

type StringKeys<T> = Extract<keyof T, string>;

type TranslationFunctionOptions = {
  replacements?: Record<string, string>,
  count?: number,
}
type TranslationFunction<T extends TranslationType> = (key: StringKeys<T>, options?: TranslationFunctionOptions) => string


export const useTranslation = <T extends TranslationType>(
  translations: Translation<Partial<TranslationType>>[],
  overwriteTranslation: OverwriteTranslationType<T> = {}
): TranslationFunction<T> => {
  const { language: languageProp, translation: overwrite } = overwriteTranslation
  const { language: inferredLanguage } = useLanguage()
  const usedLanguage = languageProp ?? inferredLanguage
  const usedTranslations = [...translations]
  if (overwrite) {
    usedTranslations.push(overwrite)
  }

  return (key: StringKeys<T>, options?: TranslationFunctionOptions): string => {
    const { count, replacements } = { ...{ count: 0, replacements: {} }, ...options }

    try {
      for (let i = translations.length - 1; i >= 0; i--) {
        const translation = translations[i]
        const localizedTranslation = translation[usedLanguage]
        if (!localizedTranslation) {
          continue
        }
        const value = localizedTranslation[key]
        if(!value) {
          continue
        }

        let forProcessing: string
        if (typeof value !== 'string') {
          if (count <= 0 && value?.zero) {
            forProcessing = value.zero
          } else if (count === 1 && value?.one) {
            forProcessing = value.one
          } else if (count === 2 && value?.two) {
            forProcessing = value.two
          } else if (count <= 10 && value?.few) {
            forProcessing = value.few
          } else if (count > 10 && value?.many) {
            forProcessing = value.many
          } else {
            forProcessing = value.other
          }
        } else {
          forProcessing = value
        }
        forProcessing = forProcessing.replace(/\{\{(\w+)}}/g, (_, placeholder) => {
          return replacements[placeholder] ?? `{{${placeholder}}}` // fallback if key is missing
        })
        return forProcessing
      }
    } catch (e) {
      console.error(e)
    }
    return `{{${usedLanguage}:${key}}}`
  }
}