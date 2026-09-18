import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import {
  createFileInputItem,
  FileInput
} from '@helpwave/hightide-native/components'

const meta = {
  component: FileInput,
} satisfies Meta<typeof FileInput>

export default meta
type Story = StoryObj<typeof meta>

export const fileInput: Story = {
  args: {
    initialValue: [],
    disabled: false,
    invalid: false,
    readOnly: false,
    maxFiles: undefined,
    maxVisualFiles: undefined,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}

export const fileInputWithFiles: Story = {
  args: {
    initialValue: [
      createFileInputItem({ name: 'lab-results.pdf' }),
      createFileInputItem({ name: 'referral.docx' }),
      createFileInputItem({ name: 'consent.pdf' }),
      createFileInputItem({ name: 'scan.png' }),
    ],
    disabled: false,
    invalid: false,
    readOnly: false,
    maxFiles: 6,
    maxVisualFiles: 2,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}

export const fileInputSingleFile: Story = {
  args: {
    initialValue: [],
    disabled: false,
    invalid: false,
    readOnly: false,
    maxFiles: 1,
    accept: ['.pdf', 'image/png'],
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}

export const fileInputLimited: Story = {
  args: {
    initialValue: [
      createFileInputItem({ name: 'lab-results.pdf' }),
      createFileInputItem({ name: 'referral.docx' }),
    ],
    disabled: false,
    invalid: false,
    readOnly: false,
    maxFiles: 3,
    accept: ['.pdf', '.docx', '.png'],
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}

export const fileInputComposed: Story = {
  args: {
    initialValue: [
      createFileInputItem({ name: 'lab-results.pdf' }),
      createFileInputItem({ name: 'referral.docx' }),
      createFileInputItem({ name: 'consent.pdf' }),
    ],
    disabled: false,
    invalid: false,
    readOnly: false,
    maxFiles: 4,
    maxVisualFiles: 2,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: function FileInputComposedStory(args) {
    return (
      <FileInput.Root
        initialValue={args.initialValue}
        disabled={args.disabled}
        invalid={args.invalid}
        readOnly={args.readOnly}
        maxFiles={args.maxFiles}
        onValueChange={args.onValueChange}
        onEditComplete={args.onEditComplete}
      >
        <FileInput.Trigger placeholder="Add files…" maxVisualFiles={args.maxVisualFiles} />
        <FileInput.Menu />
      </FileInput.Root>
    )
  },
}
