import { Editor } from '@tiptap/core'
import { newsletterEditorExtensions } from '@/components/admin/newsletter-editor-extensions'
import { repairNewsletterHtml } from '@/lib/newsletter-repair'
import {
    splitNewsletterSections,
    joinNewsletterSections,
    sectionForKind,
    textSection,
    moveSection,
    duplicateSection,
    removeSection,
    insertSectionAt,
} from '@/lib/newsletter-sections'

const serializeDoc = (content: any[]): string => {
    const editor = new Editor({
        extensions: newsletterEditorExtensions,
        content: { type: 'doc', content },
        element: document.createElement('div'),
    })
    const html = editor.getHTML()
    editor.destroy()
    return html
}

const newsletterContent = [
    {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Energy & Utilities Briefing' }],
    },
    { type: 'paragraph', content: [{ type: 'text', text: 'Welcome to this week’s edition.' }] },
    {
        type: 'niBox',
        attrs: { label: 'Bulletin' },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Regulator opened a consultation.' }] }],
    },
    { type: 'niStats', attrs: { items: [{ value: '14', label: 'Developments' }] } },
    {
        type: 'niTeam',
        attrs: { items: [{ imageUrl: '', name: 'Jane Doe', role: 'Partner', email: 'jane@nissi.co.ke' }], columns: 2 },
    },
    { type: 'paragraph', content: [{ type: 'text', text: 'Closing note.' }] },
]

const newsletterHtml = serializeDoc(newsletterContent)

const distortedHtml = [
    '<p>Intro</p>',
    '<table class="ni-table"><colgroup><col style="min-width:25px"></colgroup><tbody><tr><td>',
    '<div data-ni-box="" data-label="Bulletin"><table role="presentation"><tr><td><p>Body</p></td></tr></table></div>',
    '</td></tr></tbody></table>',
].join('')

describe('splitNewsletterSections / joinNewsletterSections', () => {
    it('round-trips a full newsletter exactly (split → join ≡ original)', () => {
        const sections = splitNewsletterSections(newsletterHtml)
        expect(joinNewsletterSections(sections)).toBe(newsletterHtml)
    })

    it('groups free content and gives every structured block its own section', () => {
        const sections = splitNewsletterSections(newsletterHtml)

        expect(sections.map((s) => s.label)).toEqual([
            'Text',
            'Box: Bulletin',
            'Statistics',
            'Team members',
            'Text',
        ])
        expect(sections.every((s) => s.id.length > 0)).toBe(true)
        expect(sections[0].html).toContain('Energy &amp; Utilities Briefing')
        expect(sections[0].html).toContain('Welcome to this week')
        expect(sections[1].html).toContain('data-ni-box')
        expect(sections[3].html).toContain('data-ni-team')
        expect(sections[4].html).toContain('Closing note.')
    })

    it('is stable across a second round trip', () => {
        const first = splitNewsletterSections(newsletterHtml)
        const joined = joinNewsletterSections(first)
        const second = splitNewsletterSections(joined)

        expect(joinNewsletterSections(second)).toBe(joined)
        expect(second.map((s) => s.label)).toEqual(first.map((s) => s.label))
    })

    it('repairs distorted input before grouping', () => {
        const sections = splitNewsletterSections(distortedHtml)
        const joined = joinNewsletterSections(sections)

        expect(joined).toContain('data-ni-box')
        expect(repairNewsletterHtml(joined)).toBe(joined)
        expect(sections.map((s) => s.label)).toEqual(['Text', 'Box: Bulletin'])
    })

    it('returns a single empty text section for empty content', () => {
        expect(splitNewsletterSections('')).toHaveLength(1)
        expect(splitNewsletterSections('')[0].label).toBe('Text')
        // Empty docs parse with a starter paragraph the user can type into.
        expect(splitNewsletterSections('').map((s) => s.html)).toEqual(['<p></p>'])
    })
})

describe('section helpers', () => {
    it('builds insertable sections from a kind', () => {
        const box = sectionForKind('box')
        expect(box.label).toBe('Box: Bulletin')
        expect(box.html).toContain('data-ni-box')

        const team = sectionForKind('team')
        expect(team.label).toBe('Team members')
        expect(team.html).toContain('data-ni-team')

        const text = sectionForKind('text')
        expect(text.label).toBe('Text')
        expect(text.html).toContain('<p>')

        const divider = sectionForKind('divider')
        expect(divider.html).toContain('ni-hr')

        expect(textSection().label).toBe('Text')
    })

    it('moves a section up and down with edge cases', () => {
        const sections = splitNewsletterSections(newsletterHtml)
        const [a, b] = sections

        const movedDown = moveSection(sections, a.id, 'down')
        expect(movedDown[0].id).toBe(b.id)
        expect(movedDown[1].id).toBe(a.id)

        expect(moveSection(sections, a.id, 'up')).toBe(sections)
        expect(moveSection(sections, sections[sections.length - 1].id, 'down')).toBe(sections)
        expect(moveSection(sections, 'missing', 'up')).toBe(sections)
    })

    it('duplicates a section after itself with a fresh id', () => {
        const sections = splitNewsletterSections(newsletterHtml)
        const duplicated = duplicateSection(sections, sections[1].id)

        expect(duplicated).toHaveLength(sections.length + 1)
        expect(duplicated[2].html).toBe(sections[1].html)
        expect(duplicated[2].id).not.toBe(sections[1].id)
        expect(duplicated[2].label).toBe(`${sections[1].label} (copy)`)
    })

    it('removes and inserts sections', () => {
        const sections = splitNewsletterSections(newsletterHtml)
        const removed = removeSection(sections, sections[0].id)
        expect(removed).toHaveLength(sections.length - 1)

        const extra = sectionForKind('stats')
        const inserted = insertSectionAt(removed, 0, extra)
        expect(inserted[0].id).toBe(extra.id)
        expect(inserted).toHaveLength(sections.length)
    })
})
