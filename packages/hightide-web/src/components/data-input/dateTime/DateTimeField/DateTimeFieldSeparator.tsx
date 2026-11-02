export function DateTimeFieldSeparator({ text }: { text: string }) {
  return (
    <span aria-hidden={true} className="date-time-separator">
      {text}
    </span>
  )
}
