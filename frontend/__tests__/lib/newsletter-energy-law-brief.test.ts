import { readFileSync } from 'fs'
import { join } from 'path'
import { Editor } from '@tiptap/core'
import { newsletterEditorExtensions } from '@/components/admin/newsletter-editor-extensions'
import { splitNewsletterSections, joinNewsletterSections } from '@/lib/newsletter-sections'
import { repairNewsletterHtml } from '@/lib/newsletter-repair'

/**
 * The Energy Law Brief issue (10–16 October 2026) as a fixture: the full
 * hand-authored content must parse through the production schema, settle
 * into a stable serialisation, stay repair-clean, and split into the
 * composer's expected cards.
 */
const CONTENT_PATH = join(__dirname, '../../../content/energy-law-brief.html')
const content = readFileSync(CONTENT_PATH, 'utf8')

const serialize = (html: string): string => {
    const editor = new Editor({
        extensions: newsletterEditorExtensions,
        content: html,
        element: document.createElement('div'),
    })
    const out = editor.getHTML()
    editor.destroy()
    return out
}

describe('Energy Law Brief issue content', () => {
    const first = serialize(content)
    const second = serialize(first)

    it('settles into a stable serialisation after one pass', () => {
        expect(second).toBe(first)
    })

    it('stays repair-clean', () => {
        expect(repairNewsletterHtml(first)).toBe(first)
    })

    it('keeps every block and count of the issue', () => {
        expect(first.match(/data-ni-box=/g)).toHaveLength(13)
        expect(first.match(/data-ni-title=/g)).toHaveLength(4)
        expect(first.match(/data-ni-grid=/g)).toHaveLength(12)
        expect(first.match(/data-ni-highlight=/g)).toHaveLength(13)
        expect(first.match(/data-ni-stats/g)).toHaveLength(1)
        expect(first.match(/data-ni-keydates/g)).toHaveLength(1)
        expect(first.match(/data-ni-team/g)).toHaveLength(1)
        expect(first.match(/data-ni-cta/g)).toHaveLength(1)
        expect(first.match(/<img/g)).toHaveLength(15)
    })

    it('preserves block-level styles through the schema', () => {
        // Date line centred, issue title in serif 34px, accent bar width.
        expect(first).toMatch(/text-align:\s*center/)
        expect(first).toMatch(/font-size:\s*34px/)
        expect(first).toMatch(/width:\s*44px/)
        expect(first).toContain('Georgia')
    })

    it('carries the issue copy end to end', () => {
        expect(first).toContain('Energy Law')
        expect(first).toContain('Paying more at the pump, but less tax on it')
        expect(first).toContain('Lamu refinery gets the go-ahead, for now')
        expect(first).toContain('Fuel importers win in court; Dangote wants to appeal')
        expect(first).toContain('A small fix to the Five Estuaries consent')
        expect(first).toContain('Does any of this affect your project?')
        expect(first).toContain('Chrispine Marvine')
        expect(first).toMatch(/EPRA.s next fuel price review/)
        // Bulletin leads render bold while stored item text stays plain.
        expect(first).toMatch(/<strong[^>]*>Kenya\.<\/strong>/)
        expect(first).toMatch(/<strong[^>]*>Nigeria\.<\/strong>/)
        expect(first).toMatch(/<strong[^>]*>UK\.<\/strong>/)
        // Article cards keep their explicit empty label.
        expect(first).toContain('data-label=""')
    })

    it('splits into the composer cards in order', () => {
        const sections = splitNewsletterSections(content)
        const labels = sections.map((section) => section.label)

        expect(labels).toEqual([
            'Text', // date line, issue title, bar, intro, divider
            'Statistics',
            'Text', // divider, hero image, lead story
            'Highlight: Impact',
            'Text', // source links
            'Box: Bulletin',
            'Text', // note from us
            'Team members',
            'Key dates',
            'Section title', // Kenya
            'Box',
            'Section title', // Ethiopia
            'Box',
            'Section title', // Nigeria
            'Box',
            'Box',
            'Section title', // United Kingdom
            'Box',
            'Box',
            'Box',
            'Box',
            'Box',
            'Box',
            'Box',
            'Box',
            'Call to action',
        ])
    })

    it('joins split sections back to the serialised content', () => {
        const sections = splitNewsletterSections(content)
        expect(joinNewsletterSections(sections)).toBe(first)
    })
})
