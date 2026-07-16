import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useHightideTranslation } from '@helpwave/hightide-utils'
import { Text, View } from 'react-native'

type StoryArgs = {
  name: string,
  gender: 'male' | 'female' | 'other',
  min: number,
  max: number,
}

const meta = {
  title: 'React Native/Internationalization/Translation',
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const translation: Story = {
  args: {
    name: 'Name',
    gender: 'other',
    min: 1,
    max: 2,
  },
  argTypes: {
    gender: {
      control: 'select',
      options: ['male', 'female', 'other'],
    },
  },
  render: ({ name, gender, min, max }) => {
    const translation = useHightideTranslation()

    return (
      <View
        style={{
          gap: 8,
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#F4F4F5',
          maxWidth: 360,
        }}
      >
        <Text style={{ fontSize: 16, color: '#18181B' }}>
          {translation('welcome')}
          {'! '}
          {translation('goodToSeeYou')}
          {', '}
          <Text style={{ color: '#2563EB', fontWeight: '600' }}>{name}</Text>
          {'.'}
        </Text>
        <Text style={{ fontSize: 16, color: '#18181B' }}>
          {translation('sGender', { gender })}
          {'.'}
        </Text>
        <Text style={{ fontSize: 16, color: '#18181B' }}>
          {translation('outOfRangeString', { min, max })}
        </Text>
      </View>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `
const translation = useHightideTranslation()

return (
  <View>
    <Text>
      {translation('welcome')}! {translation('goodToSeeYou')}, {name}.
    </Text>
    <Text>{translation('sGender', { gender })}.</Text>
    <Text>{translation('outOfRangeString', { min, max })}</Text>
  </View>
)
        `.trim(),
        language: 'tsx',
      },
    },
  },
}
