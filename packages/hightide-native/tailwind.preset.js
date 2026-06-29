/**
 * Convenience re-export of the shared hightide Tailwind / NativeWind preset.
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('@helpwave/hightide-native/tailwind.preset')],
 *     content: ['./src/**\/*.{ts,tsx}', './node_modules/@helpwave/hightide-native/dist/**\/*.js'],
 *   }
 */
const { hightidePreset } = require('@helpwave/hightide-tokens')

module.exports = hightidePreset
