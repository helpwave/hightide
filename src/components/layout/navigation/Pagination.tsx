import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { Input } from '@/src/components/user-interaction/input/Input'
import { clamp } from '@/src/utils/math'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'


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
  pageIndex,
  pageCount,
  onPageChanged,
  className,
  style,
}: PaginationProps) => {
  const translation = useHightideTranslation()
  const [value, setValue] = useState<string>((pageIndex + 1).toString())

  const noPages = pageCount === 0
  const onFirstPage = pageIndex === 0 && !noPages
  const onLastPage = pageIndex === pageCount - 1

  useEffect(() => {
    if (noPages) {
      setValue('0')
    } else {
      setValue((pageIndex + 1).toString())
    }
  }, [pageIndex, noPages])

  const changePage = (page: number) => {
    onPageChanged(page)
  }

  return (
    <div className={clsx('flex-row-1', className)} style={style}>
      <Button
        layout="icon"
        coloringStyle="text"
        color="neutral"
        onClick={() => changePage(0)} disabled={onFirstPage || noPages}
      >
        <ChevronFirst/>
      </Button>
      <Button
        layout="icon"
        coloringStyle="text"
        color="neutral"
        onClick={() => changePage(pageIndex - 1)} disabled={onFirstPage || noPages}
      >
        <ChevronLeft/>
      </Button>
      <div className="flex-row-2 min-w-56 items-center justify-center mx-2 text-center">
        <Input
          value={value}
          className={clsx(
            'w-24 text-center font-bold input-indicator-hidden h-10'
          )}
          type="number"
          min={1}
          max={pageCount}
          disabled={noPages}
          onChangeText={value => {
            if (value) {
              setValue(clamp(Number(value), [1, pageCount]).toString())
            } else {
              setValue(value)
            }
          }}
          onEditCompleted={value => {
            changePage(clamp(Number(value) - 1, [0, pageCount - 1]))
          }}
          editCompleteOptions={{ delay: 800 }}
        />
        <span className="select-none w-10">{translation('of')}</span>
        <span
          className="flex-row-2 w-24 items-center justify-center select-none h-10 bg-input-background text-input-text rounded-md font-bold"
        >
          {pageCount}
        </span>
      </div>
      <Button
        layout="icon"
        coloringStyle="text"
        color="neutral"
        onClick={() => changePage(pageIndex + 1)} disabled={onLastPage || noPages}
      >
        <ChevronRight/>
      </Button>
      <Button
        layout="icon"
        coloringStyle="text"
        color="neutral"
        onClick={() => changePage(pageCount - 1)} disabled={onLastPage || noPages}
      >
        <ChevronLast/>
      </Button>
    </div>
  )
}
