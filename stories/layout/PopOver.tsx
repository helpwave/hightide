import {CSSProperties, forwardRef, PropsWithChildren, useImperativeHandle, useRef} from 'react'
import {clsx} from "clsx";
import {createPortal} from "react-dom";

export type PopOverProps = PropsWithChildren<{
  padding?: number,
  className?: string,
  style?: CSSProperties,
}>

export const PopOver = forwardRef<HTMLDivElement, PopOverProps>(function PopOver({
                                                                                   children,
                                                                                   padding = 16,
                                                                                   style,
                                                                                   className
                                                                                 }, ref) {
  const internalRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => internalRef.current);


  return createPortal((
    <div
      ref={ref}
      className={clsx(className)}
      style={{
        position: "absolute",
        ...style
      }}
    >
      {children}
    </div>
  ), document.body)
}
