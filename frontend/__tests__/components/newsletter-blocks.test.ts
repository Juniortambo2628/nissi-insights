import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {
    newsletterBlockExtensions,
    buildBlockContent,
    ContentReference,
    DEFAULT_STATS_ITEMS,
    DEFAULT_KEY_DATES,
    DEFAULT_CTA,
} from '@/components/admin/newsletter-blocks'

const extensions = [StarterKit, ContentReference, ...newsletterBlockExtensions]

const createEditor = (content: any) =>
    new Editor({
        extensions,
        content,
        element: document.createElement('div'),
    })

const roundTrip = (content: any) => {
    const first = createEditor(content)
    const html = first.getHTML()
    first.destroy()

    const second = createEditor(html)
    const json = second.getJSON()
    second.destroy()

    return { html, json }
}

describe('newsletter block nodes', () => {
    it('round-trips a boxed section with its label kept out of the body', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [
                {
                    type: 'niBox',
                    attrs: { label: 'Bulletin' },
                    content: [
                        { type: 'paragraph', content: [{ type: 'text', text: 'This month in energy' }] },
                    ],
                },
            ],
        })

        expect(html).toContain('data-ni-box')
        expect(html).toContain('data-label="Bulletin"')
        expect(html).toContain('role="presentation"')
        expect(html).toContain('This month in energy')

        const box: any = json.content![0]
        expect(box.type).toBe('niBox')
        expect(box.attrs.label).toBe('Bulletin')
        const text = (box.content ?? []).map((child: any) =>
            (child.content ?? []).map((leaf: any) => leaf.text ?? '').join('')
        ).join('')
        expect(text).toBe('This month in energy')
    })

    it('round-trips an impact highlight with its bold label ignored', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [
                {
                    type: 'niHighlight',
                    attrs: { label: 'Impact' },
                    content: [{ type: 'text', text: 'The regulator opened a new consultation.' }],
                },
            ],
        })

        expect(html).toContain('data-ni-highlight')
        expect(html).toContain('<strong data-ni-highlight-label')
        expect(html).toContain('Impact.')

        const node: any = json.content![0]
        expect(node.type).toBe('niHighlight')
        expect(node.attrs.label).toBe('Impact')
        const text = (node.content ?? []).map((leaf: any) => leaf.text ?? '').join('')
        expect(text.trim()).toBe('The regulator opened a new consultation.')
    })

    it('round-trips statistics items as JSON attributes', () => {
        const { html, json } = roundTrip({ type: 'doc', content: [buildBlockContent('stats')] })

        expect(html).toContain('data-ni-stats')
        expect(html).toContain('data-items="[{&quot;value&quot;')
        expect(html).toContain('Developments')

        const node: any = json.content![0]
        expect(node.type).toBe('niStats')
        expect(node.attrs.items).toEqual(DEFAULT_STATS_ITEMS)
    })

    it('round-trips the key dates panel with title and items', () => {
        const { html, json } = roundTrip({ type: 'doc', content: [buildBlockContent('keydates')] })

        expect(html).toContain('data-ni-keydates')
        expect(html).toContain('data-title="Key dates to note"')

        const node: any = json.content![0]
        expect(node.type).toBe('niKeyDates')
        expect(node.attrs.title).toBe('Key dates to note')
        expect(node.attrs.items).toEqual(DEFAULT_KEY_DATES)
    })

    it('round-trips a CTA card including quotes in its body', () => {
        const attrs = {
            ...DEFAULT_CTA,
            body: 'He said "deal done" — isn\'t it great?',
        }
        const { html, json } = roundTrip({
            type: 'doc',
            content: [{ type: 'niCta', attrs }],
        })

        expect(html).toContain('data-ni-cta')
        expect(html).toContain('data-body="He said &quot;deal done&quot;')
        expect(html).toContain('href="https://www.nissi-insights.com"')
        expect(html).toContain('Talk to us')

        const node: any = json.content![0]
        expect(node.type).toBe('niCta')
        expect(node.attrs).toMatchObject(attrs)
    })

    it('round-trips two and three column grids with column content', () => {
        const grid = buildBlockContent('grid2')
        grid.content[0].content = [{ type: 'paragraph', content: [{ type: 'text', text: 'Left column' }] }]
        grid.content[1].content = [{ type: 'paragraph', content: [{ type: 'text', text: 'Right column' }] }]

        const { html, json } = roundTrip({ type: 'doc', content: [grid] })

        expect(html).toContain('data-ni-grid')
        expect(html.match(/data-ni-col/g)).toHaveLength(2)
        expect(html).toContain('Left column')
        expect(html).toContain('Right column')

        const node: any = json.content![0]
        expect(node.type).toBe('niGrid')
        expect(node.attrs.columns).toBe(2)
        expect(node.content).toHaveLength(2)
        expect(node.content[0].type).toBe('niGridColumn')
        expect(node.content[0].attrs.columns).toBe(2)

        const triple = roundTrip({ type: 'doc', content: [buildBlockContent('grid3')] })
        expect(triple.html.match(/data-ni-col/g)).toHaveLength(3)
        expect(triple.json.content![0].content).toHaveLength(3)
    })

    it('round-trips custom column widths as percent attributes', () => {
        const grid = buildBlockContent('grid2')
        grid.content[0].attrs.width = 62.5
        grid.content[1].attrs.width = 37.5
        grid.content[0].content = [{ type: 'paragraph', content: [{ type: 'text', text: 'Wide column' }] }]
        grid.content[1].content = [{ type: 'paragraph', content: [{ type: 'text', text: 'Narrow column' }] }]

        const { html, json } = roundTrip({ type: 'doc', content: [grid] })

        expect(html).toMatch(/width:\s*62\.50%/)
        expect(html).toMatch(/width:\s*37\.50%/)
        expect(html).not.toContain('width="62.5"')
        // Handles are node-view-only chrome and must never be serialized.
        expect(html).not.toContain('ni-grid-handle')

        const node: any = json.content![0]
        expect(node.content[0].attrs.width).toBeCloseTo(62.5)
        expect(node.content[1].attrs.width).toBeCloseTo(37.5)
    })

    it('builds insertable blocks with sensible defaults', () => {
        expect(buildBlockContent('box')).toMatchObject({
            type: 'niBox',
            attrs: { label: 'Bulletin' },
            content: [{ type: 'paragraph' }],
        })
        expect(buildBlockContent('highlight')).toMatchObject({
            type: 'niHighlight',
            attrs: { label: 'Impact' },
            content: [{ type: 'text', text: ' ' }],
        })
        expect(buildBlockContent('stats').attrs.items).toHaveLength(DEFAULT_STATS_ITEMS.length)
        expect(buildBlockContent('keydates').attrs.items).toHaveLength(DEFAULT_KEY_DATES.length)
        expect(buildBlockContent('cta').attrs.buttonText).toBe('Talk to us')
        expect(buildBlockContent('grid3').content).toHaveLength(3)
    })

    it('still round-trips content reference cards', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [
                {
                    type: 'contentReference',
                    attrs: {
                        refType: 'insight',
                        refId: 7,
                        title: 'Grid batteries take off',
                        excerpt: 'A short summary of the market.',
                        imageUrl: null,
                        category: 'Insight',
                        url: 'https://www.nissi-insights.com/insights/grid-batteries',
                    },
                },
            ],
        })

        expect(html).toContain('data-content-ref')
        expect(html).toContain('Grid batteries take off')

        const node: any = json.content![0]
        expect(node.type).toBe('contentReference')
        expect(node.attrs).toMatchObject({
            refType: 'insight',
            refId: 7,
            title: 'Grid batteries take off',
            category: 'Insight',
            url: 'https://www.nissi-insights.com/insights/grid-batteries',
        })
    })
})
