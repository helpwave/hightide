/**
 * Elevation / shadow tokens.
 *
 * React Native and the web express shadows very differently, so each level is
 * provided in both shapes:
 *  - `web`   – a CSS `boxShadow` string (also works with react-native-web).
 *  - `native`– the iOS shadow* props plus the Android `elevation`.
 *
 * `md` corresponds to the cards' `shadow-md`; `bottom` corresponds to the
 * custom `shadow-hw-bottom` utility used for sticky surfaces.
 */
export type NativeShadow = {
  shadowColor: string,
  shadowOffset: { width: number, height: number },
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number,
}

export type Elevation = {
  web: string,
  native: NativeShadow,
}

export const elevation = {
  none: {
    web: 'none',
    native: { shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  },
  sm: {
    web: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    native: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  },
  md: {
    web: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    native: { shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  },
  lg: {
    web: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    native: { shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8 },
  },
  /** The custom `shadow-hw-bottom` used for sticky bars / sheets. */
  bottom: {
    web: '0 1px 20px 0 rgb(0 0 0 / 0.1)',
    native: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 4 },
  },
} as const satisfies Record<string, Elevation>

export type ElevationName = keyof typeof elevation
