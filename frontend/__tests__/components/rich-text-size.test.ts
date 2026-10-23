import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, FontSize, LineHeight } from '@tiptap/extension-text-style'

const createEditor = (content: any) =>
    new Editor({
        extensions: [StarterKit, TextStyle, FontSize, LineHeight],
        content,
        element: document.createElement('div'),
    })

describe('font size and line spacing (textStyle + FontSize + LineHeight)', () => {
    it('applies size and spacing marks via editor commands and round-trips them', () => {
        const editor = createEditor('<p>Hello readers</p>')

        editor.commands.selectAll()
        editor.chain().focus().setFontSize('20px').run()
        editor.chain().focus().setLineHeight('1.5').run()
        expect(editor.isActive('textStyle', { fontSize: '20px' })).toBe(true)
        expect(editor.isActive('textStyle', { lineHeight: '1.5' })).toBe(true)

        const html = editor.getHTML()
        expect(html).toMatch(/font-size:\s*20px/)
        expect(html).toMatch(/line-height:\s*1\.5/)
        editor.destroy()

        // A save/reload cycle keeps both values.
        const second = createEditor(html)
        const marks = second.getJSON().content![0].content![0].marks ?? []
        const style = marks.find((m: any) => m.type === 'textStyle')
        expect(style?.attrs?.fontSize).toBe('20px')
        expect(style?.attrs?.lineHeight).toBe('1.5')
        second.destroy()
    })

    it('removes size and spacing via the unset commands', () => {
        const editor = createEditor('<p>Body copy</p>')

        editor.commands.selectAll()
        editor.chain().focus().setFontSize('11px').run()
        editor.chain().focus().setLineHeight('1.15').run()
        expect(editor.isActive('textStyle')).toBe(true)

        editor.commands.selectAll()
        editor.chain().focus().unsetFontSize().run()
        editor.chain().focus().unsetLineHeight().run()
        expect(editor.isActive('textStyle')).toBe(false)
        expect(editor.getHTML()).not.toMatch(/font-size/)
        expect(editor.getHTML()).not.toMatch(/line-height/)
        editor.destroy()
    })
})
