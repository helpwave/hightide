import type { ReactNode } from 'react'
import type { FormValue } from './FormStore'
import type { FormObserverKeyResult, UseFormObserverKeyProps, UseFormObserverProps } from './FormContext'
import { useFormObserver, useFormObserverKey, type FormObserverResult } from './FormContext'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'

export interface FormObserverProps<T extends FormValue> extends UseFormObserverProps<T> {
  children: (bag:FormObserverResult<T>) => ReactNode,
}

export const FormObserver = <T extends FormValue>({ children, formStore }: FormObserverProps<T>) => {
  const formObserver = useFormObserver<T>({ formStore })

  if (!formObserver) {
    throw new Error('<FormObserver> can only be used inside a <FormProvider>')
  }

  return BagFunctionUtil.resolve(children, formObserver)
}

export interface FormObserverKeyProps<T extends FormValue, K extends keyof T> extends UseFormObserverKeyProps<T, K> {
  children: (bag:FormObserverKeyResult<T, K>) => ReactNode,
}

export const FormObserverKey = <T extends FormValue, K extends keyof T>({ children, formStore, formKey }: FormObserverKeyProps<T, K>) => {
  const formObserver = useFormObserverKey<T, K>({ formStore, formKey })

  if (!formObserver) {
    throw new Error('<FormObserverKey> can only be used inside a <FormProvider>')
  }

  return BagFunctionUtil.resolve(children, formObserver)
}