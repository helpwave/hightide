import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Input } from '../user-action/Input'
import { IconButton } from '../user-action/Button'
import type { UseSearchProps } from '../../hooks/useSearch'
import { useSearch } from '../../hooks/useSearch'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type SearchableListAddonTranslation = {
  nothingFound: string,
}

type SearchableListTranslation = SearchableListAddonTranslation & FormTranslationType

const defaultSearchableListTranslation: Translation<SearchableListAddonTranslation> = {
  en: {
    nothingFound: 'Nothing found'
  },
  de: {
    nothingFound: 'Nichts gefunden'
  }
}

export type SearchableListProps<T> = UseSearchProps<T> & {
  autoFocus?: boolean,
  minimumItemsForSearch?: number,
  itemMapper: (value: T, index: number) => ReactNode,
  className?: string,
  resultListClassName?: string,
}

/**
 * A component for searching a list
 */
export const SearchableList = <T, >({
                                      overwriteTranslation,
                                      list,
                                      initialSearch = '',
                                      searchMapping,
                                      autoFocus,
                                      minimumItemsForSearch = 6,
                                      itemMapper,
                                      className,
                                      resultListClassName
                                    }: PropsForTranslation<SearchableListTranslation, SearchableListProps<T>>) => {
  const translation = useTranslation([defaultSearchableListTranslation, formTranslation], overwriteTranslation)
  const { result, hasResult, search, setSearch, updateSearch } = useSearch<T>({ list, initialSearch, searchMapping })

  return (
    <div className={clsx('col gap-y-2', className)}>
      {list.length > minimumItemsForSearch && (
        <div className="flex-row-2 justify-between items-center">
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder={translation('search')}
            autoFocus={autoFocus}
            className="w-full"
          />
          <IconButton color="neutral" onClick={() => updateSearch()}>
            <Search className="w-full h-full"/>
          </IconButton>
        </div>
      )}
      {hasResult ? (
        <div className={clsx('col gap-y-1 overflow-y-auto', resultListClassName)}>
          {result.map(itemMapper)}
        </div>
      ) : (
        <div className="row text-description py-2 px-2">{translation('nothingFound')}</div>
      )}
    </div>
  )
}