export type DurationJSON = {
  years: number,
  months: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
}

export class Duration {
  readonly years: number
  readonly months: number
  readonly days: number
  readonly hours: number
  readonly minutes: number
  readonly seconds: number
  readonly milliseconds: number

  constructor({
                years = 0,
                months = 0,
                days = 0,
                hours = 0,
                minutes = 0,
                seconds = 0,
                milliseconds = 0,
              }: Partial<DurationJSON> = {}) {
    this.assertRanges({ years, months, days, hours, minutes, seconds, milliseconds })

    this.years = years
    this.months = months
    this.days = days
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
    this.milliseconds = milliseconds
  }

  /** Date arithmetic */
  addTo(date: Date): Date {
    return this.applyTo(date, 1)
  }

  subtractFrom(date: Date): Date {
    return this.applyTo(date, -1)
  }

  /** Duration arithmetic */
  add(other: Duration): Duration {
    return new Duration({
      years: this.years + other.years,
      months: this.months + other.months,
      days: this.days + other.days,
      hours: this.hours + other.hours,
      minutes: this.minutes + other.minutes,
      seconds: this.seconds + other.seconds,
      milliseconds: this.milliseconds + other.milliseconds,
    })
  }

  subtract(other: Duration): Duration {
    return new Duration({
      years: this.years - other.years,
      months: this.months - other.months,
      days: this.days - other.days,
      hours: this.hours - other.hours,
      minutes: this.minutes - other.minutes,
      seconds: this.seconds - other.seconds,
      milliseconds: this.milliseconds - other.milliseconds,
    })
  }

  equals(other: Duration): boolean {
    return (
      this.years === other.years &&
      this.months === other.months &&
      this.days === other.days &&
      this.hours === other.hours &&
      this.minutes === other.minutes &&
      this.seconds === other.seconds &&
      this.milliseconds === other.milliseconds
    )
  }

  toJSON(): DurationJSON {
    return { ...this }
  }

  /** Static difference */
  static difference(start: Date, end: Date): Duration {
    const diff = end.getTime() - start.getTime()

    const ms = 1000
    const min = 60 * ms
    const hr = 60 * min
    const day = 24 * hr
    const month = 30 * day
    const year = 365.25 * day

    return new Duration({
      years: Math.floor(diff / year),
      months: Math.floor(diff / month),
      days: Math.floor(diff / day),
      hours: Math.floor((diff % day) / hr),
      minutes: Math.floor((diff % hr) / min),
      seconds: Math.floor((diff % min) / ms),
      milliseconds: diff % ms,
    })
  }

  private applyTo(date: Date, multiplier: 1 | -1): Date {
    const d = new Date(date)

    d.setFullYear(d.getFullYear() + multiplier * this.years)
    d.setMonth(d.getMonth() + multiplier * this.months)
    d.setDate(d.getDate() + multiplier * this.days)
    d.setHours(d.getHours() + multiplier * this.hours)
    d.setMinutes(d.getMinutes() + multiplier * this.minutes)
    d.setSeconds(d.getSeconds() + multiplier * this.seconds)
    d.setMilliseconds(d.getMilliseconds() + multiplier * this.milliseconds)

    return d
  }

  private assertRanges(d: DurationJSON): void {
    if (d.years < 0) throw new RangeError('years >= 0')
    if (d.months < 0 || d.months > 11) throw new RangeError('months: 0–11')
    if (d.days < 0) throw new RangeError('days >= 0')
    if (d.hours < 0 || d.hours > 23) throw new RangeError('hours: 0–23')
    if (d.minutes < 0 || d.minutes > 59) throw new RangeError('minutes: 0–59')
    if (d.seconds < 0 || d.seconds > 59) throw new RangeError('seconds: 0–59')
    if (d.milliseconds < 0) throw new RangeError('milliseconds >= 0')
  }

  valueOf(): number {
    return (
      this.milliseconds +
      this.seconds * 1e3 +
      this.minutes * 6e4 +
      this.hours * 3.6e6 +
      this.days * 8.64e7
    )
  }
}
