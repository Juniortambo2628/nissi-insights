import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, Color } from '@tiptap/extension-text-style'

const createEditor = (content: any) =>
    new Editor({
        extensions: [StarterKit, TextStyle, Color.configure({ types: ['textStyle'] })],
        content,
        element: document.createElement('div'),
    })

describe('text color (textStyle + Color)', () => {
    it('round-trips a colored text mark through getHTML', () => {
        const first = createEditor({
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', text: 'Important: ', marks: [{ type: 'textStyle', attrs: { color: '#dc2626' } }] },
                        { type: 'text', text: 'rest of the sentence.' },
                    ],
                },
            ],
        })

        const html = first.getHTML()
        first.destroy()

        // jsdom's cssstyle normalizes hex to rgb() when serializing styles.
        expect(html).toMatch(/color:\s*rgb\(220, 38, 38\)|color:\s*#dc2626/i)
        // Default body text must stay uncolored.
        expect(html.match(/color:/g)).toHaveLength(1)

        const second = createEditor(html)
        const json = second.getJSON()
        second.destroy()

        const marks = json.content![0].content![0].marks ?? []
        const colorMark = marks.find((m: any) => m.type === 'textStyle')
        expect(String(colorMark?.attrs?.color)).toMatch(/220, 38, 38|#dc2626/i)
    })

    it('applies and removes color via editor commands', () => {
        const editor = createEditor('<p><strong>bold</strong> text</p>')

        editor.commands.selectAll()
        editor.chain().focus().setColor('#d97706').run()
        expect(editor.isActive('textStyle', { color: '#d97706' })).toBe(true)

        editor.commands.selectAll()
        editor.chain().focus().unsetColor().run()
        expect(editor.isActive('textStyle')).toBe(false)

        editor.destroy()
    })
})
