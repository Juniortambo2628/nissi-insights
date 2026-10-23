import { repairNewsletterHtml } from '@/lib/newsletter-repair'

/**
 * Fixture mirrors the real distorted newsletter that kicked this work off:
 * a giant top-level editor table wrapping boxed sections, plus stacked
 * nested data tables used as a team-layout workaround.
 */
const GIANT_TABLE_WITH_BOXES = [
    '<p>Intro paragraph</p>',
    '<table class="ni-table"><colgroup><col style="min-width:25px"></colgroup><tbody><tr><td>',
    '<div data-ni-box="" data-label="Bulletin" style="background:rgba(148,163,184,0.08);">',
    '<table role="presentation"><tr><td style="padding:18px 20px;">',
    '<div style="font-size:11px;">BULLETIN</div>',
    '<p>Box body text</p>',
    '</td></tr></table>',
    '</div>',
    '<div data-ni-box="" data-label="A Note From Us">',
    '<table role="presentation"><tr><td><p>Note body</p></td></tr></table>',
    '</div>',
    '</td></tr></tbody></table>',
].join('')

const STACKED_NESTED_TABLES = [
    '<div data-ni-box="" data-label="Team">',
    '<table role="presentation"><tr><td>',
    '<table class="ni-table"><tbody><tr><td>',
    '<table class="ni-table"><tbody><tr><td>Jane Doe</td></tr></tbody></table>',
    '</td></tr></tbody></table>',
    '</td></tr></table>',
    '</div>',
].join('')

const DATA_TABLE_WITH_STATS = [
    '<table class="ni-table"><tbody><tr><td>',
    '<div data-ni-stats="" data-items="{&quot;value&quot;:&quot;14&quot;,&quot;label&quot;:&quot;Developments&quot;}"></div>',
    '</td></tr></tbody></table>',
].join('')

const CLEAN_TABLE = '<table class="ni-table"><tbody><tr><th>Market</th><th>Status</th></tr><tr><td>Kenya</td><td>Open</td></tr></tbody></table>'

const CLEAN_BOX = [
    '<div data-ni-box="" data-label="Bulletin">',
    '<table role="presentation"><tr><td><p>Clean body</p></td></tr></table>',
    '</div>',
].join('')

const dataTableProblems = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return Array.from(doc.body.querySelectorAll('table')).filter((table) => {
        const role = (table.getAttribute('role') || '').toLowerCase()
        if (role === 'presentation') return false
        if (table.querySelector('table')) return true
        return Array.from(table.querySelectorAll('div')).some((div) =>
            Array.from(div.attributes).some((attr) => attr.name.startsWith('data-ni-') || attr.name === 'data-content-ref')
        )
    })
}

describe('repairNewsletterHtml', () => {
    it('flattens a giant data table that wraps boxed sections', () => {
        const out = repairNewsletterHtml(GIANT_TABLE_WITH_BOXES)

        expect(out).toContain('data-ni-box')
        expect(out).toContain('Box body text')
        expect(out).toContain('Note body')
        expect(dataTableProblems(out)).toHaveLength(0)
    })

    it('flattens stacked nested data tables inside a box', () => {
        const out = repairNewsletterHtml(STACKED_NESTED_TABLES)

        expect(out).toContain('Jane Doe')
        expect(out).toContain('data-ni-box')
        expect(dataTableProblems(out)).toHaveLength(0)
    })

    it('unwraps data tables that trap a block inside a cell', () => {
        const out = repairNewsletterHtml(DATA_TABLE_WITH_STATS)

        expect(out).toContain('data-ni-stats')
        expect(dataTableProblems(out)).toHaveLength(0)
    })

    it('leaves clean data tables untouched', () => {
        expect(repairNewsletterHtml(CLEAN_TABLE)).toBe(CLEAN_TABLE)
    })

    it('leaves clean boxes (presentation table inside) untouched', () => {
        expect(repairNewsletterHtml(CLEAN_BOX)).toBe(CLEAN_BOX)
    })

    it('returns strings without tables unchanged', () => {
        const html = '<p>Just a paragraph with a &amp; entity</p>'
        expect(repairNewsletterHtml(html)).toBe(html)
        expect(repairNewsletterHtml('')).toBe('')
    })

    it('is idempotent', () => {
        for (const fixture of [GIANT_TABLE_WITH_BOXES, STACKED_NESTED_TABLES, DATA_TABLE_WITH_STATS]) {
            const once = repairNewsletterHtml(fixture)
            expect(repairNewsletterHtml(once)).toBe(once)
        }
    })
})
