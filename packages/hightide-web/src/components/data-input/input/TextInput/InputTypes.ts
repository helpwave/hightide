export type InputInterface<In, Out = In> = {
  /**
   * The controlled value of the component.
   * The component is controlled when `value` is defined; when `value` is
   * `undefined`, `initialValue` is used and the component manages its own value.
   */
  value?: In,

  /**
   * The initial value used when the component is uncontrolled.
   */
  initialValue?: In,

  /**
   * Called when the component updates its current value during an editing
   * interaction. The callback may be called even when the value is unchanged;
   * consumers should not assume that the value differs from the previous value.
   *
   * This callback is always triggered before onValueCommit with the most current value, but
   * the onValueCommit might fire significantly later (e.g. when a Multiselect Menu updates the
   * selection, but is closed only 20 seconds later)
   */
  onValueUpdate?: (value: Out) => void,

  /**
   * Called when the component considers the current editing interaction
   * complete. The component defines what constitutes completion; for example,
   * this may occur when editing is committed, an interaction ends, or a
   * component-specific editing lifecycle is completed.
   */
  onValueCommit?: (value: Out) => void,
}

export type InputComponentInterface<In, Out = In> = InputInterface<In, Out> & {
  invalid?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  required?: boolean,
}
