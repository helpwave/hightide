const MultiSubjectSearchWithMapping = <T>(search: string[], objects: T[], mapping: (value: T) => (string[] | undefined)) => {
  return objects.filter(object => {
    const mappedSearchKeywords = mapping(object)?.map(value => value.toLowerCase().trim())
    if(!mappedSearchKeywords) {
      return true
    }
    return search.every(searchValue => !!mappedSearchKeywords.find(value => !!value && value.includes(searchValue.toLowerCase().trim())))
  })
}

const MultiSearchWithMapping = <T>(search: string, objects: T[], mapping: (value: T) => (string[] | undefined)) => {
  return objects.filter(object => {
    const mappedSearchKeywords = mapping(object)?.map(value => value.toLowerCase().trim())
    if(!mappedSearchKeywords) {
      return true
    }
    return !!mappedSearchKeywords.find(value => value.includes(search.toLowerCase().trim()))
  })
}

const SimpleSearchWithMapping = <T>(search: string, objects: T[], mapping: (value: T) => string) => {
  return MultiSearchWithMapping(search, objects, value => [mapping(value)])
}

const SimpleSearch = (search: string, objects: string[]) => {
  return SimpleSearchWithMapping(search, objects, value => value)
}

export const SimpleSearchUtils = {
  MultiSubjectSearchWithMapping,
  MultiSearchWithMapping,
  SimpleSearchWithMapping,
  SimpleSearch,
}

/** @deprecated Use SimpleSearchUtils.MultiSubjectSearchWithMapping instead. */
export { MultiSubjectSearchWithMapping }

/** @deprecated Use SimpleSearchUtils.MultiSearchWithMapping instead. */
export { MultiSearchWithMapping }

/** @deprecated Use SimpleSearchUtils.SimpleSearchWithMapping instead. */
export { SimpleSearchWithMapping }

/** @deprecated Use SimpleSearchUtils.SimpleSearch instead. */
export { SimpleSearch }
