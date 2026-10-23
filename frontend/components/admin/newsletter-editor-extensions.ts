import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle, Color, FontSize, LineHeight } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import { newsletterBlockExtensions, ContentReference, ImageWithShape } from './newsletter-blocks'

/**
 * Preserve the raw style attribute on block nodes. Newsletter content is
 * written with per-element inline styles (eyebrows, serif headings, hairline
 * dividers, accent bars) — without this the editor would silently strip them
 * on the first parse → serialise cycle. Stored raw (no CSSOM read) so values
 * like var(--ni-accent,…) survive; serialisation normalises them through the
 * DOM as usual.
 */
const BlockStyles = Extension.create({
    name: 'niBlockStyles',
    addGlobalAttributes() {
        return [
            {
                types: ['paragraph', 'heading', 'horizontalRule'],
                attributes: {
                    style: {
                        default: null,
                        parseHTML: (el: HTMLElement) => el.getAttribute('style') || null,
                        renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
                    },
                },
            },
        ]
    },
})

/**
 * The exact extension list the newsletter editor runs with. Shared by the
 * RichTextEditor and the section composer's split/serialize helpers so
 * HTML round-trips identically through both (same parse rules, same
 * render output).
 */
export const newsletterEditorExtensions = [
    StarterKit.configure({
        // @ts-ignore — ensure no duplicate 'link' extension
        link: false,
        horizontalRule: {
            HTMLAttributes: { class: 'ni-hr' },
        },
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-primary hover:underline cursor-pointer',
        },
    }),
    ImageWithShape.configure({
        HTMLAttributes: {
            class: 'rounded-lg max-w-full h-auto',
            style: 'max-width:100%; height:auto; border-radius:8px;',
        },
        resize: {
            enabled: true,
            directions: ['bottom-right', 'right', 'bottom'],
            minWidth: 80,
            minHeight: 60,
            alwaysPreserveAspectRatio: true,
        },
    }),
    Table.configure({
        resizable: false,
        allowTableNodeSelection: true,
        HTMLAttributes: { class: 'ni-table' },
    }),
    TableRow.configure({ HTMLAttributes: { class: 'ni-table-row' } }),
    TableHeader.configure({ HTMLAttributes: { class: 'ni-table-header' } }),
    TableCell.configure({ HTMLAttributes: { class: 'ni-table-cell' } }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    BlockStyles,
    TextStyle,
    Color.configure({ types: ['textStyle'] }),
    FontSize,
    LineHeight,
    ContentReference,
    ...newsletterBlockExtensions,
]
