"use client"

import React from 'react'
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

export interface StatItem {
    value: string
    label: string
}

export interface KeyDateItem {
    date: string
    flag: string
    text: string
}

export interface CtaAttrs {
    heading: string
    body: string
    buttonText: string
    buttonUrl: string
    note: string
}

export const DEFAULT_STATS_ITEMS: StatItem[] = [
    { value: '14', label: 'Developments' },
    { value: '4', label: 'Markets' },
    { value: '6', label: 'Open consultations' },
]

export const DEFAULT_KEY_DATES_TITLE = 'Key dates to note'

export const DEFAULT_KEY_DATES: KeyDateItem[] = [
    { date: '29 Oct', flag: '🇬🇧', text: 'Last day to respond on the Market Stabilisation Charge' },
    { date: '6 Nov', flag: '🇬🇧', text: 'Last day to respond on the carbon capture licence re-opener' },
    { date: '8 Nov', flag: '🇬🇧', text: 'Last day to respond on heat pump targets' },
    { date: '14 Nov', flag: '🇰🇪', text: "EPRA's next fuel price review" },
    { date: '24 Nov', flag: '🇰🇪', text: 'Lamu refinery case back in court in Malindi' },
    { date: '6 Dec', flag: '🇬🇧', text: 'Last day to respond on offshore decommissioning guidance' },
    { date: '11 Dec', flag: '🇬🇧', text: 'Last day to respond on DCP 412' },
    { date: '8 Jan', flag: '🇬🇧', text: 'Last day to respond on energy smart data' },
]

export const DEFAULT_CTA: CtaAttrs = {
    heading: 'Does any of this affect your project?',
    body: 'We help developers, investors and lenders make sense of energy regulation, power purchase agreements and deal structures in Kenya, Ethiopia, Nigeria and the UK. Drop us a line.',
    buttonText: 'Talk to us',
    buttonUrl: 'https://www.nissi-insights.com',
    note: "Know someone who'd find this useful? Feel free to forward it.",
}

export const DEFAULT_BOX_LABEL = 'Bulletin'
export const DEFAULT_HIGHLIGHT_LABEL = 'Impact'

/**
 * Email-safe palette helpers. ACCENT uses a CSS variable with a literal
 * fallback: the editor resolves the variable live (set on the editor
 * wrapper from the newsletter's accent colour), and the backend replaces
 * the whole var(...) expression with the newsletter's accent colour in
 * renderedContent() before the email is previewed or sent.
 */
const ACCENT = 'var(--ni-accent,#2563eb)'
const PANEL_BG = 'rgba(148,163,184,0.08)'
const PANEL_BORDER = 'rgba(148,163,184,0.3)'
const HAIRLINE = 'rgba(148,163,184,0.25)'
const MUTED = '#94a3b8'

const PANEL_CELL = `background:${PANEL_BG}; border:1px solid ${PANEL_BORDER}; padding:18px 20px;`
const LABEL_STYLE = `font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${ACCENT}; margin-bottom:12px;`

const presentationTable = (...children: any[]): any[] => [
    'table',
    { role: 'presentation', width: '100%', cellpadding: '0', cellspacing: '0', style: 'width:100%; border-collapse:collapse;' },
    ...children,
]

const parseJsonArray = <T,>(raw: string | null | undefined, fallback: T[]): T[] => {
    try {
        const parsed = JSON.parse(raw || '[]')
        return Array.isArray(parsed) ? parsed : fallback
    } catch {
        return fallback
    }
}

const cloneStats = (items: StatItem[]): StatItem[] => items.map((i) => ({ ...i }))
const cloneDates = (items: KeyDateItem[]): KeyDateItem[] => items.map((i) => ({ ...i }))

/**
 * Boxed panel (e.g. "BULLETIN") — editable body content inside an
 * inline-styled table that survives email clients. The label is edited
 * via double-click dialog.
 */
export const NiBox = Node.create({
    name: 'niBox',
    group: 'block',
    content: 'block+',

    addAttributes() {
        return {
            label: {
                default: DEFAULT_BOX_LABEL,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-label') || DEFAULT_BOX_LABEL,
                renderHTML: (attrs) => ({ 'data-label': attrs.label }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-ni-box]',
                contentElement: (el: HTMLElement) => el.querySelector('td') as HTMLElement,
            },
            { tag: 'div[data-ni-box-label]', ignore: true, priority: 100 },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-box',
                'data-ni-box': '',
                style: 'margin:22px 0;',
            }),
            presentationTable([
                'tr',
                {},
                [
                    'td',
                    { style: PANEL_CELL },
                    [
                        'div',
                        { 'data-ni-box-label': '', style: LABEL_STYLE },
                        node.attrs.label,
                    ],
                    ['div', { style: 'margin:0;' }, 0],
                ],
            ]),
        ]
    },
})

/**
 * Impact-style highlight: left accent border with an inline bold label
 * ("Impact.") followed by editable inline text.
 */
export const NiHighlight = Node.create({
    name: 'niHighlight',
    group: 'block',
    content: 'inline*',

    addAttributes() {
        return {
            label: {
                default: DEFAULT_HIGHLIGHT_LABEL,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-label') || DEFAULT_HIGHLIGHT_LABEL,
                renderHTML: (attrs) => ({ 'data-label': attrs.label }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-ni-highlight]',
                contentElement: (el: HTMLElement) => el.querySelector('td') as HTMLElement,
            },
            { tag: 'strong[data-ni-highlight-label]', ignore: true, priority: 100 },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        const label = node.attrs.label as string
        const labelChildren: any[] = []
        if (label) {
            labelChildren.push([
                'strong',
                { 'data-ni-highlight-label': '', style: `color:${ACCENT}; margin-right:5px;` },
                `${label}.`,
            ])
        }
        labelChildren.push(['span', {}, 0])

        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-highlight',
                'data-ni-highlight': '',
                style: 'margin:18px 0;',
            }),
            presentationTable([
                'tr',
                {},
                [
                    'td',
                    { style: `border-left:3px solid ${ACCENT}; padding:4px 0 4px 16px;` },
                    ...labelChildren,
                ],
            ]),
        ]
    },
})

/**
 * Statistics row — big accent numbers with small uppercase labels
 * (e.g. 14 DEVELOPMENTS / 4 MARKETS / 6 OPEN CONSULTATIONS).
 * Edited via double-click dialog.
 */
export const NiStats = Node.create({
    name: 'niStats',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            items: {
                default: () => cloneStats(DEFAULT_STATS_ITEMS),
                parseHTML: (el: HTMLElement) => parseJsonArray<StatItem>(el.getAttribute('data-items'), cloneStats(DEFAULT_STATS_ITEMS)),
                renderHTML: (attrs) => ({ 'data-items': JSON.stringify(attrs.items || []) }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-ni-stats]' }]
    },

    renderHTML({ node, HTMLAttributes }) {
        const items: StatItem[] = node.attrs.items?.length ? node.attrs.items : cloneStats(DEFAULT_STATS_ITEMS)
        const width = (100 / items.length).toFixed(2)

        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-stats',
                'data-ni-stats': '',
                style: 'margin:26px 0;',
            }),
            presentationTable([
                'tr',
                {},
                ...items.map((it) => [
                    'td',
                    { align: 'center', style: `width:${width}%; vertical-align:top; padding:6px 8px;` },
                    ['div', { style: `font-size:32px; font-weight:700; line-height:1.15; color:${ACCENT};` }, String(it.value ?? '')],
                    ['div', { style: `font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:${MUTED}; margin-top:6px;` }, String(it.label ?? '')],
                ]),
            ]),
        ]
    },
})

/**
 * "KEY DATES TO NOTE" panel — title plus rows of date | flag | text
 * separated by hairlines. Edited via double-click dialog.
 */
export const NiKeyDates = Node.create({
    name: 'niKeyDates',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            title: {
                default: DEFAULT_KEY_DATES_TITLE,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-title') || DEFAULT_KEY_DATES_TITLE,
                renderHTML: (attrs) => ({ 'data-title': attrs.title }),
            },
            items: {
                default: () => cloneDates(DEFAULT_KEY_DATES),
                parseHTML: (el: HTMLElement) => parseJsonArray<KeyDateItem>(el.getAttribute('data-items'), cloneDates(DEFAULT_KEY_DATES)),
                renderHTML: (attrs) => ({ 'data-items': JSON.stringify(attrs.items || []) }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-ni-keydates]' }]
    },

    renderHTML({ node, HTMLAttributes }) {
        const items: KeyDateItem[] = node.attrs.items?.length ? node.attrs.items : cloneDates(DEFAULT_KEY_DATES)

        const rows = items.map((it, i) => {
            const border = i > 0 ? `border-top:1px solid ${HAIRLINE}; ` : ''
            return [
                'tr',
                {},
                ['td', { style: `width:66px; vertical-align:top; padding:10px 0; ${border}font-size:14px; font-weight:700; color:${ACCENT};` }, String(it.date ?? '')],
                ['td', { style: `width:34px; vertical-align:top; padding:10px 10px 10px 0; ${border}font-size:14px;` }, String(it.flag ?? '')],
                ['td', { style: `vertical-align:top; padding:10px 0; ${border}font-size:14px; line-height:1.5;` }, String(it.text ?? '')],
            ]
        })

        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-keydates',
                'data-ni-keydates': '',
                style: 'margin:22px 0;',
            }),
            presentationTable([
                'tr',
                {},
                [
                    'td',
                    { style: PANEL_CELL },
                    ['div', { style: LABEL_STYLE }, node.attrs.title],
                    presentationTable(...rows),
                ],
            ]),
        ]
    },
})

/**
 * Grid of 2 or 3 equal columns (e.g. the team section under
 * "A NOTE FROM US"). Each column holds normal block content.
 */
export const NiGridColumn = Node.create({
    name: 'niGridColumn',
    content: 'block+',

    addAttributes() {
        return {
            columns: {
                default: 2,
                parseHTML: (el: HTMLElement) => parseInt(el.getAttribute('data-columns') || '2', 10),
                renderHTML: (attrs) => ({ 'data-columns': String(attrs.columns) }),
            },
            // Width as a percentage of the grid row. Rendered by the node's
            // renderHTML below (not as a separate attribute style) so it
            // merges cleanly with the base column styles. renderHTML must
            // return nothing, otherwise the attr leaks into a legacy
            // width="62.5" HTML attribute that email clients may treat
            // as pixels.
            width: {
                default: null,
                parseHTML: (el: HTMLElement) => {
                    const match = /([\d.]+)%/.exec(el.style?.width || '')
                    return match ? parseFloat(match[1]) : null
                },
                renderHTML: () => ({}),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'td[data-ni-col]' }]
    },

    renderHTML({ node, HTMLAttributes }) {
        const columns = Number(node.attrs.columns) || 2
        const width = Number(node.attrs.width)
        const widthCss = Number.isFinite(width) && width > 0
            ? width.toFixed(2)
            : (100 / columns).toFixed(2)

        return [
            'td',
            mergeAttributes(HTMLAttributes, {
                'data-ni-col': '',
                style: `width:${widthCss}%; vertical-align:top; padding:0;`,
            }),
            0,
        ]
    },
})

/**
 * Editor-only node view for grids: renders the same email-safe table as the
 * static renderHTML, plus drag handles between columns for resizing. Handles
 * live only in this React view — they never reach getHTML()/the saved email.
 * Column proportions are committed as `width` % attributes on niGridColumn,
 * and always written for every column so widths sum to exactly 100.
 */
interface GridDragState {
    index: number
    startX: number
    widths: number[]
}

const GridView = ({ node, editor, getPos }: any) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const dragRef = React.useRef<GridDragState | null>(null)
    const [boundaries, setBoundaries] = React.useState<number[]>([])

    const getColumnTds = React.useCallback((): HTMLElement[] => {
        const row = containerRef.current?.querySelector('table tr')
        if (!row) return []
        return Array.from(row.children).filter((el): el is HTMLElement => el.tagName === 'TD')
    }, [])

    const measure = React.useCallback(() => {
        const container = containerRef.current
        const tds = getColumnTds()
        if (!container || tds.length < 2) {
            setBoundaries((prev) => (prev.length === 0 ? prev : []))
            return
        }
        const containerLeft = container.getBoundingClientRect().left
        const xs: number[] = []
        for (let i = 1; i < tds.length; i++) {
            const prevRight = tds[i - 1].getBoundingClientRect().right
            const nextLeft = tds[i].getBoundingClientRect().left
            xs.push((prevRight + nextLeft) / 2 - containerLeft)
        }
        setBoundaries((prev) =>
            prev.length === xs.length && prev.every((v, i) => Math.abs(v - xs[i]) < 1) ? prev : xs
        )
    }, [getColumnTds])

    React.useEffect(() => {
        measure()
        const onResize = () => measure()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [measure, node])

    const commitWidths = React.useCallback(
        (percents: number[]) => {
            const pos = typeof getPos === 'function' ? getPos() : undefined
            if (pos === undefined) return
            editor.chain().command(({ tr }: any) => {
                const grid = tr.doc.nodeAt(pos)
                if (!grid || grid.type.name !== 'niGrid') return false
                let i = 0
                grid.forEach((column: any, offset: number) => {
                    if (i < percents.length) {
                        tr.setNodeMarkup(pos + 1 + offset, undefined, {
                            ...column.attrs,
                            width: Math.round(percents[i] * 100) / 100,
                        })
                    }
                    i++
                })
                return true
            }).run()
        },
        [editor, getPos]
    )

    const handleMove = React.useCallback(
        (e: MouseEvent) => {
            const drag = dragRef.current
            if (!drag) return
            const tds = getColumnTds()
            if (!tds[drag.index - 1] || !tds[drag.index]) return

            const total = drag.widths.reduce((sum, w) => sum + w, 0)
            const MIN = 60
            let left = drag.widths[drag.index - 1] + (e.clientX - drag.startX)
            let right = drag.widths[drag.index] - (e.clientX - drag.startX)
            if (left < MIN) {
                right -= MIN - left
                left = MIN
            }
            if (right < MIN) {
                left -= MIN - right
                right = MIN
            }

            tds[drag.index - 1].style.width = `${(left / total) * 100}%`
            tds[drag.index].style.width = `${(right / total) * 100}%`
        },
        [getColumnTds]
    )

    const handleUp = React.useCallback(() => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)

        const drag = dragRef.current
        dragRef.current = null
        if (!drag) return

        const tds = getColumnTds()
        if (tds.length < 2) return
        const widths = tds.map((td) => td.getBoundingClientRect().width)
        const total = widths.reduce((sum, w) => sum + w, 0)
        if (total <= 0) return

        tds.forEach((td) => {
            td.style.width = ''
        })
        commitWidths(widths.map((w) => (w / total) * 100))
    }, [handleMove, getColumnTds, commitWidths])

    React.useEffect(
        () => () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleUp)
        },
        [handleMove, handleUp]
    )

    const startDrag = React.useCallback(
        (index: number) => (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            const tds = getColumnTds()
            if (!tds[index - 1] || !tds[index]) return
            dragRef.current = {
                index,
                startX: e.clientX,
                widths: tds.map((td) => td.getBoundingClientRect().width),
            }
            window.addEventListener('mousemove', handleMove)
            window.addEventListener('mouseup', handleUp)
        },
        [handleMove, handleUp, getColumnTds]
    )

    const resetWidths = () => {
        const tds = getColumnTds()
        if (tds.length < 2) return
        const even = 100 / tds.length
        commitWidths(tds.map(() => even))
    }

    return (
        <NodeViewWrapper className="ni-grid" style={{ margin: '20px -10px' }}>
            <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
                <table
                    role="presentation"
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px 0' }}
                >
                    <NodeViewContent as={'tr' as any} />
                </table>
                {boundaries.map((x, i) => (
                    <span
                        key={i}
                        className="ni-grid-handle"
                        contentEditable={false}
                        data-ni-grid-handle=""
                        style={{ left: `${x}px` }}
                        title="Drag to resize columns (double-click to reset)"
                        onMouseDown={startDrag(i + 1)}
                        onDoubleClick={resetWidths}
                    />
                ))}
            </div>
        </NodeViewWrapper>
    )
}

export const NiGrid = Node.create({
    name: 'niGrid',
    group: 'block',
    content: 'niGridColumn+',

    addAttributes() {
        return {
            columns: {
                default: 2,
                parseHTML: (el: HTMLElement) => parseInt(el.getAttribute('data-columns') || '2', 10),
                renderHTML: (attrs) => ({ 'data-columns': String(attrs.columns) }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-ni-grid]',
                contentElement: (el: HTMLElement) => el.querySelector('tr') as HTMLElement,
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-grid',
                'data-ni-grid': '',
                style: 'margin:20px -10px;',
            }),
            [
                'table',
                {
                    role: 'presentation',
                    width: '100%',
                    cellpadding: '0',
                    cellspacing: '0',
                    style: 'width:100%; border-collapse:separate; border-spacing:10px 0;',
                },
                ['tr', {}, 0],
            ],
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(GridView)
    },
})

/**
 * "Does any of this affect your project?" call-to-action card —
 * heading, body, accent button and footnote, all edited via dialog.
 */
export const NiCta = Node.create({
    name: 'niCta',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            heading: {
                default: DEFAULT_CTA.heading,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-heading') || DEFAULT_CTA.heading,
                renderHTML: (attrs) => ({ 'data-heading': attrs.heading }),
            },
            body: {
                default: DEFAULT_CTA.body,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-body') || DEFAULT_CTA.body,
                renderHTML: (attrs) => ({ 'data-body': attrs.body }),
            },
            buttonText: {
                default: DEFAULT_CTA.buttonText,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-button-text') || DEFAULT_CTA.buttonText,
                renderHTML: (attrs) => ({ 'data-button-text': attrs.buttonText }),
            },
            buttonUrl: {
                default: DEFAULT_CTA.buttonUrl,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-button-url') || DEFAULT_CTA.buttonUrl,
                renderHTML: (attrs) => ({ 'data-button-url': attrs.buttonUrl }),
            },
            note: {
                default: DEFAULT_CTA.note,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-note') || DEFAULT_CTA.note,
                renderHTML: (attrs) => ({ 'data-note': attrs.note }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-ni-cta]' }]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-cta',
                'data-ni-cta': '',
                style: 'margin:26px 0;',
            }),
            presentationTable([
                'tr',
                {},
                [
                    'td',
                    { style: `border:1px solid ${ACCENT}; padding:30px 26px; text-align:center;` },
                    ['div', { style: 'font-size:19px; font-weight:700; line-height:1.4; margin-bottom:12px;' }, String(node.attrs.heading ?? '')],
                    ['div', { style: 'font-size:15px; line-height:1.65; margin:0 0 4px;' }, String(node.attrs.body ?? '')],
                    [
                        'a',
                        {
                            href: String(node.attrs.buttonUrl ?? '#'),
                            style: `display:inline-block; background:${ACCENT}; color:#ffffff; font-weight:700; font-size:15px; text-decoration:none; padding:13px 30px; border-radius:6px; margin:20px 0 14px;`,
                        },
                        String(node.attrs.buttonText ?? ''),
                    ],
                    ['div', { style: `font-size:12px; line-height:1.6; color:${MUTED}; margin:0;` }, String(node.attrs.note ?? '')],
                ],
            ]),
        ]
    },
})

/**
 * Content reference card (insight / resource). Lives here so it can be
 * tested alongside the other custom nodes. Registered separately from
 * newsletterBlockExtensions because it is shared beyond newsletters.
 */
export const ContentReference = Node.create({
    name: 'contentReference',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            refType: { default: 'insight' },
            refId: { default: 0 },
            title: { default: '' },
            excerpt: { default: '' },
            imageUrl: { default: null },
            category: { default: '' },
            url: { default: '' },
        }
    },

    parseHTML() {
        return [{
            tag: 'div[data-content-ref]',
            getAttrs: (el) => {
                if (typeof el === 'string') return null
                const div = el as HTMLElement
                return {
                    refType: div.getAttribute('data-ref-type') || 'insight',
                    refId: parseInt(div.getAttribute('data-ref-id') || '0', 10),
                    title: div.getAttribute('data-title') || '',
                    excerpt: div.getAttribute('data-excerpt') || '',
                    imageUrl: div.getAttribute('data-image-url') || null,
                    category: div.getAttribute('data-category') || '',
                    url: div.getAttribute('data-url') || '',
                }
            },
        }]
    },

    renderHTML({ HTMLAttributes }) {
        const { title, excerpt, imageUrl, category, url } = HTMLAttributes

        const textChildren: any[] = []

        if (category) {
            textChildren.push([
                'div',
                { style: 'font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#64748b; margin-bottom:6px;' },
                category,
            ])
        }

        textChildren.push([
            'div',
            { style: 'font-size:17px; font-weight:700; line-height:1.3; margin-bottom:8px;' },
            title,
        ])

        if (excerpt) {
            textChildren.push([
                'div',
                { style: 'font-size:14px; line-height:1.6; color:#64748b; margin-bottom:12px;' },
                excerpt,
            ])
        }

        if (url) {
            textChildren.push([
                'a',
                { href: url, style: 'font-size:13px; font-weight:600; text-decoration:none; color:inherit;' },
                'Read more →',
            ])
        }

        const textCell = ['td', { style: 'vertical-align:top;' }, ...textChildren]

        const rowChildren = imageUrl
            ? [
                [
                    'td',
                    { style: 'padding:0 16px 0 0; vertical-align:top; width:160px;' },
                    ['img', { src: imageUrl, alt: '', width: '160', style: 'display:block; width:160px; height:auto; border-radius:8px; object-fit:cover;' }],
                ],
                textCell,
            ]
            : [textCell]

        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-content-ref': '',
                style: 'border:1px solid rgba(148,163,184,0.3); border-radius:12px; padding:20px; margin:20px 0; background:rgba(15,23,42,0.03);',
            }),
            [
                'table',
                { role: 'presentation', width: '100%', cellpadding: '0', cellspacing: '0', style: 'width:100%; border-collapse:collapse;' },
                ['tr', {}, ...rowChildren],
            ],
        ]
    },
})

export const newsletterBlockExtensions = [NiBox, NiHighlight, NiStats, NiKeyDates, NiGrid, NiGridColumn, NiCta]

/** Node types whose double-click opens an attribute-editing dialog. */
export const DIALOG_NODE_TYPES = ['niStats', 'niKeyDates', 'niCta', 'niBox', 'niHighlight'] as const

export type DialogNodeType = (typeof DIALOG_NODE_TYPES)[number]

export type BlockKind = 'box' | 'highlight' | 'stats' | 'keydates' | 'cta' | 'grid2' | 'grid3'

/** Build insertable content for a toolbar block. */
export const buildBlockContent = (kind: BlockKind): any => {
    switch (kind) {
        case 'box':
            return { type: 'niBox', attrs: { label: DEFAULT_BOX_LABEL }, content: [{ type: 'paragraph' }] }
        case 'highlight':
            return { type: 'niHighlight', attrs: { label: DEFAULT_HIGHLIGHT_LABEL }, content: [{ type: 'text', text: ' ' }] }
        case 'stats':
            return { type: 'niStats', attrs: { items: cloneStats(DEFAULT_STATS_ITEMS) } }
        case 'keydates':
            return { type: 'niKeyDates', attrs: { title: DEFAULT_KEY_DATES_TITLE, items: cloneDates(DEFAULT_KEY_DATES) } }
        case 'cta':
            return { type: 'niCta', attrs: { ...DEFAULT_CTA } }
        case 'grid2':
        case 'grid3': {
            const columns = kind === 'grid2' ? 2 : 3
            return {
                type: 'niGrid',
                attrs: { columns },
                content: Array.from({ length: columns }, () => ({
                    type: 'niGridColumn',
                    attrs: { columns },
                    content: [{ type: 'paragraph' }],
                })),
            }
        }
    }
}
