import { Editor, getHTMLFromFragment, getSchema } from '@tiptap/core'
import { repairNewsletterHtml } from './newsletter-repair'
import { newsletterEditorExtensions } from '@/components/admin/newsletter-editor-extensions'
import { buildBlockContent, BlockKind } from '@/components/admin/newsletter-blocks'

/**
 * Section-based composition over the newsletter's single HTML string.
 *
 * splitNewsletterSections parses content into top-level nodes and groups
 * them: runs of free content (paragraphs, headings, lists, images, tables)
 * become one "Text" section, every structured block (box, stats, team…)
 * becomes its own section. joinNewsletterSections concatenates section
 * HTML back into the original string — serialisation is node-local, so
 * split → join reproduces the editor's own getHTML output exactly.
 *
 * Section structure is in-memory only; nothing about the saved content
 * format changes (autosave, revisions and templates stay untouched).
 */

export interface NewsletterSection {
    id: string
    label: string
    html: string
}

const FREE_BLOCK_TYPES = new Set([
    'paragraph',
    'heading',
    'bulletList',
    'orderedList',
    'blockquote',
    'horizontalRule',
    'image',
    'table',
])

const newId = (): string =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sec-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`

/** Parse probe sharing the exact production schema (HTML → JSON). */
const createProbe = (content: string): Editor =>
    new Editor({
        extensions: newsletterEditorExtensions,
        content,
        element: document.createElement('div'),
    })

/**
 * Serialize node JSON exactly the way editor.getHTML() does (it calls the
 * same getHTMLFromFragment). Serializing groups this way — instead of
 * through setContent — keeps output node-local: no trailing paragraphs
 * injected, and split → join stays byte-identical to the original.
 */
const schema = getSchema(newsletterEditorExtensions)

const serializeNodes = (nodes: any[]): string => {
    const doc = schema.nodeFromJSON({ type: 'doc', content: nodes })
    return getHTMLFromFragment(doc.content, schema)
}

const labelForNode = (node: any): string => {
    switch (node.type) {
        case 'niBox':
            return `Box: ${node.attrs?.label || 'Untitled'}`
        case 'niHighlight':
            return `Highlight: ${node.attrs?.label || 'Untitled'}`
        case 'niStats':
            return 'Statistics'
        case 'niKeyDates':
            return 'Key dates'
        case 'niNumberedList':
            return 'Numbered list'
        case 'niTitle':
            return 'Section title'
        case 'niCta':
            return 'Call to action'
        case 'niTeam':
            return 'Team members'
        case 'niGrid':
            return node.attrs?.columns === 3 ? 'Three-column layout' : 'Two-column layout'
        case 'contentReference':
            return 'Content card'
        case 'image':
            return 'Image'
        case 'horizontalRule':
            return 'Divider'
        default:
            return 'Section'
    }
}

/**
 * Split newsletter HTML into sections. Repairs nested-table distortions
 * first, so a loaded legacy newsletter comes back structurally clean.
 */
export const splitNewsletterSections = (html: string): NewsletterSection[] => {
    const repaired = repairNewsletterHtml(html || '')
    const probe = createProbe(repaired)

    try {
        const nodes = ((probe.getJSON().content ?? []) as any[]).filter(Boolean)

        if (!nodes.length) {
            return [{ id: newId(), label: 'Text', html: '' }]
        }

        const groups: { free: boolean; nodes: any[] }[] = []
        for (const node of nodes) {
            const free = FREE_BLOCK_TYPES.has(node.type)
            const last = groups[groups.length - 1]
            if (free && last?.free) {
                last.nodes.push(node)
            } else {
                groups.push({ free, nodes: [node] })
            }
        }

        return groups.map((group) => ({
            id: newId(),
            label: group.free ? 'Text' : labelForNode(group.nodes[0]),
            html: serializeNodes(group.nodes),
        }))
    } finally {
        probe.destroy()
    }
}

export const joinNewsletterSections = (sections: NewsletterSection[]): string =>
    sections.map((section) => section.html).join('')

/** Fresh empty text section (used for new/empty content). */
export const textSection = (): NewsletterSection => sectionForKind('text')

/** Build a section from an insert-menu kind. */
export const sectionForKind = (kind: BlockKind | 'text' | 'divider'): NewsletterSection => {
    const content =
        kind === 'text'
            ? { type: 'paragraph' }
            : kind === 'divider'
                ? { type: 'horizontalRule' }
                : buildBlockContent(kind)

    return {
        id: newId(),
        label: kind === 'text' ? 'Text' : labelForNode(content),
        html: serializeNodes([content]),
    }
}

export const moveSection = (
    sections: NewsletterSection[],
    id: string,
    direction: 'up' | 'down'
): NewsletterSection[] => {
    const index = sections.findIndex((section) => section.id === id)
    if (index < 0) return sections
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= sections.length) return sections

    const next = [...sections]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    return next
}

export const duplicateSection = (
    sections: NewsletterSection[],
    id: string
): NewsletterSection[] => {
    const index = sections.findIndex((section) => section.id === id)
    if (index < 0) return sections

    const copy: NewsletterSection = {
        ...sections[index],
        id: newId(),
        label: `${sections[index].label} (copy)`,
    }
    const next = [...sections]
    next.splice(index + 1, 0, copy)
    return next
}

export const removeSection = (
    sections: NewsletterSection[],
    id: string
): NewsletterSection[] => sections.filter((section) => section.id !== id)

export const insertSectionAt = (
    sections: NewsletterSection[],
    index: number,
    section: NewsletterSection
): NewsletterSection[] => {
    const next = [...sections]
    next.splice(index, 0, section)
    return next
}
