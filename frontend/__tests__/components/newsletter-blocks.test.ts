import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {
    newsletterBlockExtensions,
    buildBlockContent,
    ContentReference,
    ImageWithShape,
    DEFAULT_STATS_ITEMS,
    DEFAULT_KEY_DATES,
    DEFAULT_CTA,
    DEFAULT_NUMBERED_ITEMS,
    DEFAULT_TITLE,
    DEFAULT_TITLE_LABEL,
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
        // Default placement: left-aligned, top-aligned.
        expect(html).toMatch(/text-align:\s*left/)
        expect(html).toMatch(/vertical-align:\s*top/)

        const box: any = json.content![0]
        expect(box.type).toBe('niBox')
        expect(box.attrs.label).toBe('Bulletin')
        const text = (box.content ?? []).map((child: any) =>
            (child.content ?? []).map((leaf: any) => leaf.text ?? '').join('')
        ).join('')
        expect(text).toBe('This month in energy')
    })

    it('round-trips custom box alignment attributes', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [
                {
                    type: 'niBox',
                    attrs: { label: 'Centre panel', align: 'center', valign: 'middle' },
                    content: [
                        { type: 'paragraph', content: [{ type: 'text', text: 'Centred content' }] },
                    ],
                },
            ],
        })

        expect(html).toMatch(/text-align:\s*center/)
        expect(html).toMatch(/vertical-align:\s*middle/)
        // The attrs must never leak as HTML attributes.
        expect(html).not.toContain('align="center"')
        expect(html).not.toContain('valign="middle"')

        const box: any = json.content![0]
        expect(box.attrs.align).toBe('center')
        expect(box.attrs.valign).toBe('middle')
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

    it('round-trips a numbered list with auto-indexed rows', () => {
        const items = [
            { text: 'UK. Ofgem opened a market-conduct review.' },
            { text: 'Kenya. EPRA cut retail tariffs by 4%.' },
        ]
        const { html, json } = roundTrip({
            type: 'doc',
            content: [{ type: 'niNumberedList', attrs: { items } }],
        })

        expect(html).toContain('data-ni-numberedlist')
        expect(html).toContain('UK. Ofgem opened a market-conduct review.')
        // Numbers are derived from the row index, not stored per row.
        expect(html).toMatch(/<td[^>]*>\s*1\s*<\/td>/)
        expect(html).toMatch(/<td[^>]*>\s*2\s*<\/td>/)
        expect(html).toMatch(/font-size:\s*22px/)
        // jsdom's cssstyle drops var() colours, so assert the node spec
        // itself: numerals render in the newsletter accent token.
        const first = createEditor({
            type: 'doc',
            content: [{ type: 'niNumberedList', attrs: { items } }],
        })
        const spec = (first.schema.nodes.niNumberedList.spec.toDOM as any)(
            first.schema.nodes.niNumberedList.create({ items })
        )
        first.destroy()
        expect(JSON.stringify(spec)).toContain('var(--ni-accent,#2563eb)')

        const node: any = json.content![0]
        expect(node.type).toBe('niNumberedList')
        expect(node.attrs.items).toEqual(items)
    })

    it('keeps a numbered list nested inside a boxed section', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [
                {
                    type: 'niBox',
                    attrs: { label: 'Bulletin' },
                    content: [
                        { type: 'niNumberedList', attrs: { items: [{ text: 'Point one' }] } },
                    ],
                },
            ],
        })

        expect(html).toContain('data-ni-box')
        expect(html).toContain('data-ni-numberedlist')
        expect(html).toContain('Point one')

        const box: any = json.content![0]
        expect(box.content[0].type).toBe('niNumberedList')
    })

    it('round-trips the section title with label and hairline rule', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [{ type: 'niTitle', attrs: { title: 'Kenya', label: '1 update' } }],
        })

        expect(html).toContain('data-ni-title')
        expect(html).toContain('data-title="Kenya"')
        expect(html).toContain('data-label="1 update"')
        expect(html).toMatch(/border-bottom:\s*1px solid/)
        expect(html).toMatch(/text-align:\s*right/)
        // jsdom's cssstyle drops var() colours, so assert the node spec
        // itself: the title follows the newsletter text colour token.
        const first = createEditor({
            type: 'doc',
            content: [{ type: 'niTitle', attrs: { title: 'Kenya', label: '1 update' } }],
        })
        const spec = (first.schema.nodes.niTitle.spec.toDOM as any)(
            first.schema.nodes.niTitle.create({ title: 'Kenya', label: '1 update' })
        )
        first.destroy()
        expect(JSON.stringify(spec)).toContain('var(--ni-text,#0f172a)')

        const node: any = json.content![0]
        expect(node.type).toBe('niTitle')
        expect(node.attrs.title).toBe('Kenya')
        expect(node.attrs.label).toBe('1 update')
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

    it('round-trips team members with photos, roles and mailto links', () => {
        const items = [
            { imageUrl: 'https://api.nissi-insights.com/api/storage/team/jane.jpg', name: 'Jane Doe', role: 'Partner', email: 'jane@nissi.co.ke' },
            { imageUrl: '', name: 'John Smith', role: 'Analyst', email: 'john@nissi.co.ke' },
        ]
        const { html, json } = roundTrip({
            type: 'doc',
            content: [{ type: 'niTeam', attrs: { items, columns: 2 } }],
        })

        expect(html).toContain('data-ni-team')
        expect(html).toContain('role="presentation"')
        expect(html).toContain('https://api.nissi-insights.com/api/storage/team/jane.jpg')
        expect(html).toContain('mailto:jane@nissi.co.ke')
        expect(html).toContain('mailto:john@nissi.co.ke')
        expect(html).toContain('Jane Doe')
        expect(html).toContain('Partner')
        // Plain links only — no editor chrome classes on mailto links.
        expect(html).not.toContain('cursor-pointer')

        const node: any = json.content![0]
        expect(node.type).toBe('niTeam')
        expect(node.attrs.items).toHaveLength(2)
        expect(node.attrs.items[0]).toMatchObject(items[0])
        expect(node.attrs.items[1]).toMatchObject(items[1])
        expect(node.attrs.columns).toBe(2)
    })

    it('renders one team member per row when columns is 1', () => {
        const items = [
            { imageUrl: '', name: 'Jane Doe', role: 'Partner', email: 'jane@nissi.co.ke' },
            { imageUrl: '', name: 'John Smith', role: 'Analyst', email: 'john@nissi.co.ke' },
        ]
        const { html, json } = roundTrip({
            type: 'doc',
            content: [{ type: 'niTeam', attrs: { items, columns: 1 } }],
        })

        // Full-width layout: each member gets its own row.
        expect(html.match(/<tr/g)).toHaveLength(2)

        const node: any = json.content![0]
        expect(node.type).toBe('niTeam')
        expect(node.attrs.columns).toBe(1)
    })

    it('round-trips a team block nested inside a boxed section', () => {
        const { html, json } = roundTrip({
            type: 'doc',
            content: [
                {
                    type: 'niBox',
                    attrs: { label: 'Team' },
                    content: [
                        { type: 'niTeam', attrs: { items: [{ imageUrl: '', name: 'Jane Doe', role: 'Partner', email: 'jane@nissi.co.ke' }], columns: 2 } },
                    ],
                },
            ],
        })

        expect(html).toContain('data-ni-box')
        expect(html).toContain('data-ni-team')
        expect(html).toContain('mailto:jane@nissi.co.ke')

        const box: any = json.content![0]
        expect(box.type).toBe('niBox')
        expect(box.content[0].type).toBe('niTeam')
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
        // Column divider: border-left on every column except the first.
        // jsdom serializes CSS with a space after the colon.
        expect(html).toMatch(/border-left:\s*1px solid/)
        // No legacy grid spacing — dividers sit flush, no negative margins.
        expect(html).not.toContain('border-spacing:10px')
        expect(html).not.toMatch(/margin:20px -10px/)

        const node: any = json.content![0]
        expect(node.type).toBe('niGrid')
        expect(node.attrs.columns).toBe(2)
        expect(node.content).toHaveLength(2)
        expect(node.content[0].type).toBe('niGridColumn')
        expect(node.content[0].attrs.columns).toBe(2)

        const triple = roundTrip({ type: 'doc', content: [buildBlockContent('grid3')] })
        expect(triple.html.match(/data-ni-col/g)).toHaveLength(3)
        expect(triple.json.content![0].content).toHaveLength(3)
        // Three columns → two divider rules.
        expect(triple.html.match(/border-left:\s*1px solid/g)).toHaveLength(2)
    })

    it('round-trips custom column alignment attributes', () => {
        const grid = buildBlockContent('grid2')
        grid.content[0].attrs.align = 'right'
        grid.content[0].attrs.valign = 'bottom'
        grid.content[0].content = [{ type: 'paragraph', content: [{ type: 'text', text: 'Aligned' }] }]

        const { html, json } = roundTrip({ type: 'doc', content: [grid] })

        expect(html).toMatch(/text-align:\s*right/)
        expect(html).toMatch(/vertical-align:\s*bottom/)
        expect(html).not.toContain('align="right"')

        const node: any = json.content![0]
        expect(node.content[0].attrs.align).toBe('right')
        expect(node.content[0].attrs.valign).toBe('bottom')
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

    it('round-trips image shape and accent frame attributes', () => {
        const makeEditor = (content: any) =>
            new Editor({
                extensions: [StarterKit, ImageWithShape.configure({ resize: false })],
                content,
                element: document.createElement('div'),
            })

        const first = makeEditor({
            type: 'doc',
            content: [
                {
                    type: 'image',
                    attrs: { src: 'https://example.com/avatar.png', alt: 'Avatar', shape: 'circle', frame: 'accent' },
                },
            ],
        })
        const html = first.getHTML()
        first.destroy()

        expect(html).toMatch(/border-radius:\s*50%/)
        expect(html).toContain('data-shape="circle"')
        expect(html).toContain('data-frame="accent"')

        const second = makeEditor(html)
        const json = second.getJSON()
        second.destroy()

        const node: any = json.content![0]
        expect(node.type).toBe('image')
        expect(node.attrs.shape).toBe('circle')
        expect(node.attrs.frame).toBe('accent')
    })

    it('defaults images to a square shape with no frame', () => {
        const makeEditor = (content: any) =>
            new Editor({
                extensions: [StarterKit, ImageWithShape.configure({ resize: false })],
                content,
                element: document.createElement('div'),
            })

        const first = makeEditor({
            type: 'doc',
            content: [{ type: 'image', attrs: { src: 'https://example.com/photo.jpg' } }],
        })
        const html = first.getHTML()
        first.destroy()

        expect(html).toMatch(/border-radius:\s*8px/)
        expect(html).toContain('data-shape="square"')
        expect(html).toContain('data-frame="none"')

        const second = makeEditor(html)
        const json = second.getJSON()
        second.destroy()

        const node: any = json.content![0]
        expect(node.attrs.shape).toBe('square')
        expect(node.attrs.frame).toBe('none')
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
        expect(buildBlockContent('numberedlist')).toMatchObject({ type: 'niNumberedList' })
        expect(buildBlockContent('numberedlist').attrs.items).toHaveLength(DEFAULT_NUMBERED_ITEMS.length)
        expect(buildBlockContent('title')).toMatchObject({
            type: 'niTitle',
            attrs: { title: DEFAULT_TITLE, label: DEFAULT_TITLE_LABEL },
        })
        expect(buildBlockContent('cta').attrs.buttonText).toBe('Talk to us')
        expect(buildBlockContent('team')).toMatchObject({ type: 'niTeam' })
        expect(buildBlockContent('team').attrs.items).toHaveLength(1)
        expect(buildBlockContent('team').attrs.columns).toBe(2)
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
