## Adding a Story

The story path mirrors `src/components`. A story for `src/components/layout/Modal` lives in `stories/layout/Modal`. Grouping folders stay lowercase. A folder that holds one aggregate uses that aggregate's name.

You can use the `title` to change the displayed _hierarchy_.
**Make sure** that this _hierarchy_ is the **same as the path**
in which you have saved the story.

```typescript
const meta = {
  title: 'Category/Folder/ComponentGroup',
  component: Circle,
} satisfies Meta<typeof Circle>

export default meta
type Story = StoryObj<typeof meta>;

export const Circle: Story = {
  args: {
    radius: 40,
    color: 'primary',
    className: '',
  },
}
```
