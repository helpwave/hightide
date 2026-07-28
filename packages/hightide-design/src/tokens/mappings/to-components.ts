import type { ComponentColorTokens } from '../../types/component-colors'
import type {
  HightideColorPalleteTokens,
  HightideSemanticColorTokens
} from '../../types/hightide'

export type ToComponentsArgs<PrimitiveTokens, SemanticTokens> = {
  themeName: string,
  primitiveTokens: PrimitiveTokens,
  semanticTokens: SemanticTokens,
}

export const toHightideComponentTokens = ({
  themeName,
  primitiveTokens,
  semanticTokens,
}: ToComponentsArgs<HightideColorPalleteTokens, HightideSemanticColorTokens>): ComponentColorTokens => {
  const { gray, purple, blue, white } = primitiveTokens
  const semantic = semanticTokens

  if (themeName === 'dark') {
    return {
      carouselDot: {
        active: semantic.primary,
        disabled: semantic.disabled,
      },
      input: {
        background: semantic.surfaceVariant,
        text: semantic.onSurface,
      },
      menu: {
        background: semantic.surfaceVariant,
        text: semantic.onSurface,
        border: gray.value[600],
      },
      overlay: {
        background: semantic.surface,
        text: semantic.onSurface,
        shadow: '#00000061',
      },
      progressIndicator: {
        fill: semantic.primary,
        background: gray.value[700],
      },
      processModel: {
        edge: {
          stroke: semantic.primary,
          label: {
            background: gray.value[700],
            textStrong: semantic.primary,
            textMuted: purple.value[300],
          },
        },
        terminal: {
          fill: semantic.primary,
          fillActive: semantic.primaryHover,
          fillVisited: purple.value[400],
        },
        activityIcon: {
          background: purple.value[100],
        },
        node: {
          activeRing: purple.value[100],
          activeBackground: gray.value[700],
          visitedBorder: purple.value[200],
          visitedBackground: gray.value[750],
        },
      },
      propertyTitle: {
        background: gray.value[750],
        text: semantic.description,
      },
      scrollbar: {
        track: '#FFFFFF33',
        thumb: gray.value[300],
      },
      stepperBarDot: {
        active: semantic.primary,
        normal: purple.value[100],
        disabled: semantic.description,
      },
      switch: {
        track: {
          inactive: semantic.surfaceVariant,
          active: semantic.primary,
        },
        thumb: {
          inactive: gray.value[400],
          active: semantic.onSurface,
        },
        borderColor: gray.value[600],
      },
      table: {
        background: semantic.surface,
        text: semantic.onSurface,
        headerBackground: semantic.surfaceVariant,
        rowHoverBackground: semantic.surfaceHover,
      },
      textImage: {
        primary: {
          background: semantic.primary,
          text: white.value,
        },
        secondary: {
          background: blue.value[500],
          text: white.value,
        },
        dark: {
          background: blue.value[900],
          text: white.value,
        },
      },
      tooltip: {
        background: semantic.surfaceVariant,
        text: semantic.description,
      },
      border: gray.value[600],
      divider: gray.value[700],
      focus: semantic.primary,
      outline: gray.value[700],
      outlineVariant: gray.value[600],
    }
  }

  return {
    carouselDot: {
      active: semantic.primary,
      disabled: semantic.disabled,
    },
    input: {
      background: semantic.surfaceVariant,
      text: semantic.onSurface,
    },
    menu: {
      background: semantic.surfaceVariant,
      text: semantic.onSurface,
      border: gray.value[200],
    },
    overlay: {
      background: semantic.surface,
      text: semantic.onSurface,
      shadow: '#00000038',
    },
    progressIndicator: {
      fill: semantic.primary,
      background: gray.value[300],
    },
    processModel: {
      edge: {
        stroke: semantic.primary,
        label: {
          background: gray.value[100],
          textStrong: semantic.primary,
          textMuted: purple.value[300],
        },
      },
      terminal: {
        fill: semantic.primary,
        fillActive: semantic.primaryHover,
        fillVisited: purple.value[400],
      },
      activityIcon: {
        background: purple.value[100],
      },
      node: {
        activeRing: purple.value[100],
        activeBackground: purple.value[50],
        visitedBorder: purple.value[200],
        visitedBackground: '#fdf9ff',
      },
    },
    propertyTitle: {
      background: gray.value[100],
      text: semantic.description,
    },
    scrollbar: {
      track: '#00000033',
      thumb: gray.value[600],
    },
    stepperBarDot: {
      active: semantic.primary,
      normal: purple.value[100],
      disabled: semantic.description,
    },
    switch: {
      track: {
        inactive: semantic.surfaceVariant,
        active: semantic.primary,
      },
      thumb: {
        inactive: gray.value[400],
        active: white.value,
      },
      borderColor: gray.value[200],
    },
    table: {
      background: semantic.surface,
      text: semantic.onSurface,
      headerBackground: semantic.surfaceVariant,
      rowHoverBackground: semantic.surfaceHover,
    },
    textImage: {
      primary: {
        background: semantic.primary,
        text: white.value,
      },
      secondary: {
        background: blue.value[500],
        text: white.value,
      },
      dark: {
        background: blue.value[900],
        text: white.value,
      },
    },
    tooltip: {
      background: semantic.surfaceVariant,
      text: semantic.description,
    },
    border: gray.value[200],
    divider: gray.value[100],
    focus: semantic.primary,
    outline: gray.value[100],
    outlineVariant: gray.value[200],
  }
}
