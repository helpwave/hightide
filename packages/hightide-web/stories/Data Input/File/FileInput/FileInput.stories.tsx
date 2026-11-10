import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { FileInput } from '../../../../src/components/data-input/file/FileInput/FileInput'
import { createFileInputItem } from '../../../../src/components/data-input/file/FileInput/fileInputItem'

const meta: Meta<typeof FileInput> = {
  component: FileInput,
}

export default meta
type Story = StoryObj<typeof meta>

export const fileInput: Story = {
  args: {
    initialValue: [],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    maxFiles: undefined,
    maxVisualFiles: undefined,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
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
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    maxFiles: 6,
    maxVisualFiles: 2,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
}

export const fileInputSingleFile: Story = {
  args: {
    initialValue: [],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    maxFiles: 1,
    accept: ['.pdf', 'image/png'],
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
}

export const fileInputLimited: Story = {
  args: {
    initialValue: [
      createFileInputItem({ name: 'lab-results.pdf' }),
      createFileInputItem({ name: 'referral.docx' }),
    ],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    maxFiles: 3,
    accept: ['.pdf', '.docx', '.png'],
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
}

export const fileInputComposed: Story = {
  args: {
    initialValue: [
      createFileInputItem({ name: 'lab-results.pdf' }),
      createFileInputItem({ name: 'referral.docx' }),
      createFileInputItem({ name: 'consent.pdf' }),
    ],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    maxFiles: 4,
    maxVisualFiles: 2,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: (args) => (
    <FileInput.StateManager
      initialValue={args.initialValue}
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      isReadOnly={args.isReadOnly}
      maxFiles={args.maxFiles}
      onValueChange={args.onValueChange}
      onStateEvent={args.onStateEvent}
    >
      <FileInput.Layout>
        <FileInput.Input />
        <FileInput.Trigger placeholder="Add files…" maxVisualFiles={args.maxVisualFiles} />
      </FileInput.Layout>
      <FileInput.Menu />
    </FileInput.StateManager>
  ),
}
