/**
 * Structural repair for newsletter HTML.
 *
 * Fixes the two distortions table-based editing produced:
 *  1. Data tables nested inside data tables (stacked layout hacks).
 *  2. Block wrappers (boxes, grids, stats…) trapped inside a data table.
 *
 * Rules (run until stable):
 *  - A table WITHOUT role="presentation" that contains any table is
 *    unwrapped — its cells' contents replace it. Presentation tables
 *    (boxes, stats, team…) are legitimate outer wrappers and never
 *    unwrapped as the outer table, so a data table inside a box stays.
 *  - A table WITHOUT role="presentation" that contains a block marker
 *    (div[data-ni-*] / div[data-content-ref]) is unwrapped the same way.
 *
 * Idempotent: already-clean HTML comes back byte-identical.
 */

const BLOCK_MARKER_ATTRS = (el: Element): boolean => {
    for (const name of Array.from(el.attributes).map((a) => a.name)) {
        if (name.startsWith('data-ni-') || name === 'data-content-ref') return true
    }
    return false
}

const isPresentation = (table: Element): boolean =>
    (table.getAttribute('role') || '').toLowerCase() === 'presentation'

const needsRepair = (table: Element): boolean => {
    if (table.querySelector('table')) return true
    const divs = table.querySelectorAll('div')
    for (const div of Array.from(divs)) {
        if (BLOCK_MARKER_ATTRS(div)) return true
    }
    return false
}

/** Replace a table with the contents of its outermost cells, in order. */
const unwrapTable = (table: Element, doc: Document): boolean => {
    const parent = table.parentNode
    if (!parent) return false

    const cells = Array.from(table.querySelectorAll('td, th'))
    const outermost = cells.filter((cell) => !cells.some((other) => other !== cell && other.contains(cell)))

    const fragment = doc.createDocumentFragment()
    for (const cell of outermost) {
        while (cell.firstChild) fragment.appendChild(cell.firstChild)
    }

    parent.insertBefore(fragment, table)
    parent.removeChild(table)
    return true
}

/**
 * Repair nested-table / block-in-table distortions. Returns the input
 * unchanged when there is nothing to fix (or DOMParser is unavailable).
 */
export const repairNewsletterHtml = (html: string): string => {
    if (!html || !html.includes('<table')) return html
    if (typeof DOMParser === 'undefined') return html

    const doc = new DOMParser().parseFromString(html, 'text/html')
    const body = doc.body
    if (!body) return html

    let changed = false
    for (let round = 0; round < 10; round++) {
        const bad = Array.from(body.querySelectorAll('table')).find((t) => !isPresentation(t) && needsRepair(t))
        if (!bad) break
        if (!unwrapTable(bad, doc)) break
        changed = true
    }

    return changed ? body.innerHTML : html
}
