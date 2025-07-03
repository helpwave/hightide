import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import { Input } from '../user-action/Input'
import { clamp } from '../../util/math'
import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

type PaginationTranslation = FormTranslationType

export type PaginationProps = {
  pageIndex: number, // starts with 0
  pageCount: number,
  onPageChanged: (page: number) => void,
  className?: string,
  style?: CSSProperties,
}

/**
 * A Component showing the pagination allowing first, before, next and last page navigation
 */
export const Pagination = ({
                             overwriteTranslation,
                             pageIndex,
                             pageCount,
                             onPageChanged,
                             className,
                             style,
                           }: PropsForTranslation<PaginationTranslation, PaginationProps>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  const [value, setValue] = useState<string>((pageIndex + 1).toString())

  useEffect(() => {
    setValue((pageIndex + 1).toString())
  }, [pageIndex])

  const changePage = (page: number) => {
    onPageChanged(page)
  }

  const noPages = pageCount === 0
  const onFirstPage = pageIndex === 0 && !noPages
  const onLastPage = pageIndex === pageCount - 1

  return (
    <div className={clsx('row', { 'opacity-30': noPages }, className)} style={style}>
      <button onClick={() => changePage(0)} disabled={onFirstPage}>
        <ChevronFirst className={clsx({ 'opacity-30': onFirstPage })}/>
      </button>
      <button onClick={() => changePage(pageIndex - 1)} disabled={onFirstPage}>
        <ChevronLeft className={clsx({ 'opacity-30': onFirstPage })}/>
      </button>
      <div className="row min-w-56 gap-x-2 items-center justify-center mx-2 text-center">
        <Input
          value={value}
          containerClassName="flex flex-1 h-10"
          className={clsx(
            'w-full text-center',
            // disable up-down indicators for common browsers
            'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]'
          )}
          type="number"
          min={1}
          max={pageCount}
          onChangeText={value => {
            if (value) {
              setValue(clamp(Number(value), 1, pageCount).toString())
            } else {
              setValue(value)
            }
          }}
          onEditCompleted={value => {
            changePage(clamp(Number(value) - 1, 0, pageCount - 1))
          }}
        />
        <span className="select-none w-10">{translation('of')}</span>
        <span className="select-none text-left flex-1 font-bold">{pageCount}</span>
      </div>
      <button onClick={() => changePage(pageIndex + 1)} disabled={onLastPage || noPages}>
        <ChevronRight className={clsx({ 'opacity-30': onLastPage })}/>
      </button>
      <button onClick={() => changePage(pageCount - 1)} disabled={onLastPage || noPages}>
        <ChevronLast className={clsx({ 'opacity-30': onLastPage })}/>
      </button>
    </div>
  )
}
