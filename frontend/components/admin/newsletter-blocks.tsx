"use client"

import React from 'react'
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import Image from '@tiptap/extension-image'
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
} from 'lucide-react'

export interface StatItem {
    value: string
    label: string
}

export interface KeyDateItem {
    date: string
    flag: string
    text: string
}

export interface NumberedItem {
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

export const DEFAULT_NUMBERED_ITEMS: NumberedItem[] = [
    { text: 'First point in the list — keep it to a line or two.' },
    { text: 'Second point in the list — add as many rows as you need.' },
]

export const DEFAULT_TITLE = 'Section title'
export const DEFAULT_TITLE_LABEL = 'This week'

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

/**
 * Image shape + frame options shared by the attribute dialog and the
 * editor's image node. The frame ring uses var(--ni-accent) so it follows
 * the newsletter accent colour live and resolves to a literal colour in
 * the rendered email.
 */
export const IMAGE_SHAPE_OPTIONS = [
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'circle', label: 'Circle' },
] as const

export const IMAGE_FRAME_OPTIONS = [
    { value: 'none', label: 'No frame' },
    { value: 'accent', label: 'Accent ring' },
] as const

export const imageShapeRadius = (attrs: { shape?: string | null }): string =>
    attrs.shape === 'circle' ? '50%' : attrs.shape === 'rounded' ? '16px' : '8px'

export const imageShapeStyle = (attrs: { shape?: string | null }): string =>
    `border-radius: ${imageShapeRadius(attrs)}`

export const imageBorderStyle = (attrs: { frame?: string | null }): string =>
    attrs.frame === 'accent' ? `3px solid ${ACCENT}` : ''

export const imageFrameStyle = (attrs: { frame?: string | null }): string => {
    const border = imageBorderStyle(attrs)
    return border ? `border: ${border}` : ''
}

/**
 * The image resize node view applies attributes once at creation, so a
 * shape/frame change from the dialog has to be re-applied to the live img
 * element. Only touch the two properties via CSSOM — never the whole
 * style attribute — so the resize handles' width/height survive.
 */
const applyImageShapeStyle = (nodeView: any, attrs: Record<string, any>) => {
    const root = nodeView?.dom
    const img = root && (root.tagName === 'IMG' ? root : root.querySelector?.('img'))
    if (!img) return
    img.style.setProperty('border-radius', imageShapeRadius(attrs))
    img.style.setProperty('border', imageBorderStyle(attrs))
}

/**
 * Image with shape (square / rounded / circle) and accent-frame attributes.
 * The data-* mirrors round-trip reliably for the parser; the style
 * declarations carry the actual visuals (email-safe inline styles).
 */
export const ImageWithShape = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            shape: {
                default: 'square',
                parseHTML: (el: HTMLElement) => {
                    const data = el.getAttribute('data-shape')
                    if (data) return data
                    const raw = el.getAttribute('style') || ''
                    if (/border-radius:\s*50%/.test(raw)) return 'circle'
                    if (/border-radius:\s*16px/.test(raw)) return 'rounded'
                    return 'square'
                },
                renderHTML: (attrs) => ({
                    style: `border-radius: ${imageShapeRadius(attrs)}`,
                    'data-shape': attrs.shape || 'square',
                }),
            },
            frame: {
                default: 'none',
                parseHTML: (el: HTMLElement) =>
                    el.getAttribute('data-frame') ||
                    (/var\(--ni-accent/.test(el.getAttribute('style') || '') ? 'accent' : 'none'),
                renderHTML: (attrs) => {
                    const border = imageBorderStyle(attrs)
                    return border
                        ? { style: `border: ${border}`, 'data-frame': attrs.frame || 'accent' }
                        : { 'data-frame': attrs.frame || 'none' }
                },
            },
        }
    },
    addNodeView() {
        const parentFactory: any = this.parent?.()
        if (!parentFactory) return null
        return (props: any) => {
            const nodeView = parentFactory(props)
            if (!nodeView || typeof nodeView.update !== 'function') return nodeView
            const originalUpdate = nodeView.update.bind(nodeView)
            nodeView.update = (node: any, decorations: any, innerDecorations: any) => {
                const result = originalUpdate(node, decorations, innerDecorations)
                applyImageShapeStyle(nodeView, node.attrs)
                return result
            }
            return nodeView
        }
    },
})

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
const cloneNumbered = (items: NumberedItem[]): NumberedItem[] => items.map((i) => ({ ...i }))

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
            // Content placement inside the panel (rendered on the td so it
            // inherits into every child; email-safe table CSS).
            align: {
                default: 'left',
                parseHTML: (el: HTMLElement) => el.querySelector('td')?.style.textAlign || 'left',
                renderHTML: () => ({}),
            },
            valign: {
                default: 'top',
                parseHTML: (el: HTMLElement) => el.querySelector('td')?.style.verticalAlign || 'top',
                renderHTML: () => ({}),
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
        const align = node.attrs.align || 'left'
        const valign = node.attrs.valign || 'top'

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
                    { style: `${PANEL_CELL} text-align:${align}; vertical-align:${valign};` },
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
 * Numbered list panel — large accent numerals beside one-line rows
 * (e.g. inside the Bulletin box). Numbers are derived from the row
 * index, so reordering rows renumbers automatically. Edited via
 * double-click dialog.
 */
export const NiNumberedList = Node.create({
    name: 'niNumberedList',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            items: {
                default: () => cloneNumbered(DEFAULT_NUMBERED_ITEMS),
                parseHTML: (el: HTMLElement) => parseJsonArray<NumberedItem>(el.getAttribute('data-items'), cloneNumbered(DEFAULT_NUMBERED_ITEMS)),
                renderHTML: (attrs) => ({ 'data-items': JSON.stringify(attrs.items || []) }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-ni-numberedlist]' }]
    },

    renderHTML({ node, HTMLAttributes }) {
        const items: NumberedItem[] = node.attrs.items?.length ? node.attrs.items : cloneNumbered(DEFAULT_NUMBERED_ITEMS)

        const rows = items.map((it, i) => [
            'tr',
            {},
            ['td', { style: `width:46px; vertical-align:top; padding:9px 0; font-size:22px; font-weight:700; line-height:1.2; color:${ACCENT};` }, String(i + 1)],
            ['td', { style: `vertical-align:top; padding:9px 0; font-size:14px; line-height:1.5;` }, String(it.text ?? '')],
        ])

        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-numberedlist',
                'data-ni-numberedlist': '',
                style: 'margin:14px 0;',
            }),
            presentationTable(...rows),
        ]
    },
})

/**
 * Section title row — bold heading on the left, small uppercase label on
 * the right, with a hairline rule underneath (e.g. "🇰🇪 Kenya" / "1 UPDATE").
 * Edited via double-click dialog.
 */
export const NiTitle = Node.create({
    name: 'niTitle',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            title: {
                default: DEFAULT_TITLE,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-title') || DEFAULT_TITLE,
                renderHTML: (attrs) => ({ 'data-title': attrs.title }),
            },
            label: {
                default: DEFAULT_TITLE_LABEL,
                parseHTML: (el: HTMLElement) => el.getAttribute('data-label') || DEFAULT_TITLE_LABEL,
                renderHTML: (attrs) => ({ 'data-label': attrs.label }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-ni-title]' }]
    },

    renderHTML({ node, HTMLAttributes }) {
        const title = String(node.attrs.title ?? '')
        const label = String(node.attrs.label ?? '')
        const rule = `border-bottom:1px solid ${HAIRLINE}; padding-bottom:10px;`

        const labelCell: any[] = label
            ? ['td', { style: `${rule} text-align:right; vertical-align:bottom;` }, ['div', { style: `font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:${MUTED};` }, label]]
            : ['td', { style: rule }, ['div', {}, '']]

        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                class: 'ni-title',
                'data-ni-title': '',
                style: 'margin:26px 0 6px;',
            }),
            presentationTable([
                'tr',
                {},
                ['td', { style: `${rule} padding-right:14px;` }, ['div', { style: `font-size:20px; font-weight:700; line-height:1.3; color:var(--ni-text,#0f172a);` }, title]],
                labelCell,
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
            // Content placement inside the column (rendered on the td so it
            // inherits into every child; email-safe table CSS).
            align: {
                default: 'left',
                parseHTML: (el: HTMLElement) => el.style?.textAlign || 'left',
                renderHTML: () => ({}),
            },
            valign: {
                default: 'top',
                parseHTML: (el: HTMLElement) => el.style?.verticalAlign || 'top',
                renderHTML: () => ({}),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'td[data-ni-col]' }]
    },

    // `this.editor` comes from TipTap's extension context binding.
    renderHTML(this: any, { node, HTMLAttributes }: any) {
        const editor = this?.editor
        const columns = Number(node.attrs.columns) || 2
        const width = Number(node.attrs.width)
        const widthCss = Number.isFinite(width) && width > 0
            ? width.toFixed(2)
            : (100 / columns).toFixed(2)

        // ProseMirror model nodes have no sibling links, so locate this
        // column inside its parent grid via the editor's document.
        let index = 0
        let total = columns
        if (editor) {
            editor.state.doc.descendants((ancestor: any) => {
                if (ancestor.type.name !== 'niGrid') return true
                let i = 0
                let found = false
                ancestor.forEach((child: any) => {
                    if (child === node) {
                        index = i
                        found = true
                    }
                    i++
                })
                if (found) {
                    total = ancestor.childCount
                    return false
                }
                return true
            })
        }

        // Visible divider between columns plus comfortable gutters: the
        // border-left sits at the column boundary, with equal padding on
        // both sides so content never touches the rule.
        const divider = index > 0 ? `border-left:1px solid ${PANEL_BORDER}; ` : ''
        const padding = total <= 1
            ? 'padding:0;'
            : index === 0
                ? 'padding:2px 20px 2px 0;'
                : index === total - 1
                    ? 'padding:2px 0 2px 20px;'
                    : 'padding:2px 20px;'

        const align = node.attrs.align || 'left'
        const valign = node.attrs.valign || 'top'

        return [
            'td',
            mergeAttributes(HTMLAttributes, {
                'data-ni-col': '',
                style: `width:${widthCss}%; vertical-align:${valign}; text-align:${align}; ${divider}${padding}`,
            }),
            0,
        ]
    },
})

/**
 * Editor-only node view for grids: renders the same email-safe table as the
 * static renderHTML (divider rule + padded columns), plus editor chrome:
 *
 * - A floating toolbar (visible while the cursor is inside the grid) with
 *   alignment controls for the active column, width presets, and
 *   add/remove column actions.
 * - Drag handles centered on each column divider with live % badges while
 *   dragging. Double-click a handle to reset to equal columns.
 *
 * All chrome lives only in this React view — it never reaches getHTML().
 * Column proportions are committed as `width` % attributes on niGridColumn,
 * and always written for every column so widths sum to exactly 100.
 */
interface GridDragState {
    index: number
    startX: number
    widths: number[]
}

interface ColumnBadge {
    x: number
    pct: number
}

const GRID_ALIGN_OPTIONS = [
    { value: 'left', Icon: AlignLeft, title: 'Align content left' },
    { value: 'center', Icon: AlignCenter, title: 'Centre content' },
    { value: 'right', Icon: AlignRight, title: 'Align content right' },
] as const

const GRID_VALIGN_OPTIONS = [
    { value: 'top', Icon: AlignVerticalJustifyStart, title: 'Content to top' },
    { value: 'middle', Icon: AlignVerticalJustifyCenter, title: 'Content to middle' },
    { value: 'bottom', Icon: AlignVerticalJustifyEnd, title: 'Content to bottom' },
] as const

const gridPresets = (count: number): { label: string; percents: number[] }[] => {
    if (count === 2) {
        return [
            { label: 'Equal', percents: [50, 50] },
            { label: '60 / 40', percents: [60, 40] },
            { label: '40 / 60', percents: [40, 60] },
        ]
    }
    if (count === 3) {
        return [
            { label: 'Equal', percents: [33.33, 33.33, 33.34] },
            { label: '40/30/30', percents: [40, 30, 30] },
            { label: '30/30/40', percents: [30, 30, 40] },
        ]
    }
    const even = 100 / count
    return [{ label: 'Equal', percents: Array.from({ length: count }, () => even) }]
}

const GridView = ({ node, editor, getPos }: any) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const dragRef = React.useRef<GridDragState | null>(null)
    const [boundaries, setBoundaries] = React.useState<number[]>([])
    const [isActive, setIsActive] = React.useState(false)
    const [activeCol, setActiveCol] = React.useState(-1)
    const [colAttrs, setColAttrs] = React.useState<{ align: string; valign: string }>({
        align: 'left',
        valign: 'top',
    })
    const [dragBadges, setDragBadges] = React.useState<ColumnBadge[] | null>(null)

    const columnCount: number = node.childCount || Number(node.attrs.columns) || 2

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
            xs.push(tds[i].getBoundingClientRect().left - containerLeft)
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

    // Track whether the cursor is inside this grid and which column it is
    // in, so the toolbar can show contextual controls.
    React.useEffect(() => {
        const readActive = () => {
            const pos = typeof getPos === 'function' ? getPos() : undefined
            const { from } = editor.state.selection
            if (pos === undefined || from < pos || from > pos + node.nodeSize) {
                setIsActive(false)
                setActiveCol(-1)
                return
            }
            setIsActive(true)
            const $from = editor.state.doc.resolve(from)
            for (let d = $from.depth; d > 0; d--) {
                if ($from.node(d).type.name === 'niGridColumn') {
                    const column = $from.node(d)
                    setActiveCol($from.index(d))
                    setColAttrs({
                        align: column.attrs.align || 'left',
                        valign: column.attrs.valign || 'top',
                    })
                    return
                }
            }
            setActiveCol(-1)
        }
        readActive()
        editor.on('selectionUpdate', readActive)
        return () => {
            editor.off('selectionUpdate', readActive)
        }
    }, [editor, node, getPos])

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

    const setColumnAttrs = React.useCallback(
        (patch: Record<string, any>) => {
            if (activeCol < 0) return
            const pos = typeof getPos === 'function' ? getPos() : undefined
            if (pos === undefined) return
            editor.chain().command(({ tr }: any) => {
                const grid = tr.doc.nodeAt(pos)
                if (!grid || grid.type.name !== 'niGrid') return false
                let i = 0
                grid.forEach((column: any, offset: number) => {
                    if (i === activeCol) {
                        tr.setNodeMarkup(pos + 1 + offset, undefined, { ...column.attrs, ...patch })
                    }
                    i++
                })
                return true
            }).run()
            setColAttrs((prev) => ({ ...prev, ...patch }))
        },
        [editor, getPos, activeCol]
    )

    const addColumn = React.useCallback(() => {
        const pos = typeof getPos === 'function' ? getPos() : undefined
        if (pos === undefined) return
        editor.chain().command(({ tr }: any) => {
            const grid = tr.doc.nodeAt(pos)
            if (!grid || grid.type.name !== 'niGrid' || grid.childCount >= 4) return false
            const count = grid.childCount + 1
            const column = editor.schema.nodes.niGridColumn.create(
                { columns: count, width: null, align: 'left', valign: 'top' },
                editor.schema.nodes.paragraph.create()
            )
            tr.insert(pos + 1 + grid.content.size, column)
            const even = Math.round((100 / count) * 100) / 100
            const updated = tr.doc.nodeAt(pos)
            updated.forEach((child: any, offset: number) => {
                tr.setNodeMarkup(pos + 1 + offset, undefined, {
                    ...child.attrs,
                    columns: count,
                    width: even,
                })
            })
            tr.setNodeMarkup(pos, undefined, { ...updated.attrs, columns: count })
            return true
        }).run()
    }, [editor, getPos])

    const removeColumn = React.useCallback(() => {
        const pos = typeof getPos === 'function' ? getPos() : undefined
        if (pos === undefined) return
        editor.chain().command(({ tr }: any) => {
            const grid = tr.doc.nodeAt(pos)
            if (!grid || grid.type.name !== 'niGrid' || grid.childCount <= 1) return false
            const count = grid.childCount - 1
            let lastOffset = 0
            let lastSize = 0
            grid.forEach((child: any, offset: number) => {
                lastOffset = offset
                lastSize = child.nodeSize
            })
            tr.delete(pos + 1 + lastOffset, pos + 1 + lastOffset + lastSize)
            const updated = tr.doc.nodeAt(pos)
            const widths: number[] = []
            updated.forEach((child: any) => {
                widths.push(Number(child.attrs.width) > 0 ? Number(child.attrs.width) : 0)
            })
            let percents: number[]
            if (widths.every((w) => w > 0)) {
                const total = widths.reduce((sum, w) => sum + w, 0)
                percents = widths.map((w) => (w / total) * 100)
            } else {
                const even = 100 / updated.childCount
                percents = widths.map(() => even)
            }
            let i = 0
            updated.forEach((child: any, offset: number) => {
                tr.setNodeMarkup(pos + 1 + offset, undefined, {
                    ...child.attrs,
                    columns: count,
                    width: Math.round(percents[i] * 100) / 100,
                })
                i++
            })
            tr.setNodeMarkup(pos, undefined, { ...updated.attrs, columns: count })
            return true
        }).run()
    }, [editor, getPos])

    const handleMove = React.useCallback(
        (e: MouseEvent) => {
            const drag = dragRef.current
            if (!drag) return
            const tds = getColumnTds()
            if (!tds[drag.index - 1] || !tds[drag.index]) return

            const total = drag.widths.reduce((sum, w) => sum + w, 0)
            const MIN = 80
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

            // Live badges above each column showing its current share.
            const container = containerRef.current
            if (container) {
                const containerLeft = container.getBoundingClientRect().left
                const badges: ColumnBadge[] = tds.map((td, i) => {
                    const pct =
                        i === drag.index - 1
                            ? (left / total) * 100
                            : i === drag.index
                                ? (right / total) * 100
                                : (drag.widths[i] / total) * 100
                    const rect = td.getBoundingClientRect()
                    return { x: rect.left - containerLeft + rect.width / 2, pct }
                })
                setDragBadges(badges)
            }
        },
        [getColumnTds]
    )

    const handleUp = React.useCallback(() => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)

        const drag = dragRef.current
        dragRef.current = null
        setDragBadges(null)
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
        const even = 100 / columnCount
        commitWidths(Array.from({ length: columnCount }, () => even))
    }

    const presets = gridPresets(columnCount)

    return (
        <NodeViewWrapper className="ni-grid" style={{ margin: '20px 0' }}>
            <div
                ref={containerRef}
                className={isActive ? 'ni-grid-container ni-grid-active' : 'ni-grid-container'}
                style={{ position: 'relative', width: '100%' }}
            >
                <table
                    role="presentation"
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}
                >
                    <NodeViewContent as={'tr' as any} />
                </table>

                {isActive && (
                    <div
                        className="ni-grid-toolbar"
                        contentEditable={false}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <span className="ni-grid-toolbar-label">
                            {activeCol >= 0 ? `Column ${activeCol + 1}` : 'Columns'}
                        </span>
                        <div className="ni-grid-toolbar-group">
                            {GRID_ALIGN_OPTIONS.map(({ value, Icon, title }) => (
                                <button
                                    key={value}
                                    type="button"
                                    title={title}
                                    className={`ni-grid-toolbar-btn${
                                        colAttrs.align === value ? ' ni-grid-toolbar-btn-active' : ''
                                    }`}
                                    onClick={() => setColumnAttrs({ align: value })}
                                >
                                    <Icon size={13} />
                                </button>
                            ))}
                        </div>
                        <div className="ni-grid-toolbar-group">
                            {GRID_VALIGN_OPTIONS.map(({ value, Icon, title }) => (
                                <button
                                    key={value}
                                    type="button"
                                    title={title}
                                    className={`ni-grid-toolbar-btn${
                                        colAttrs.valign === value ? ' ni-grid-toolbar-btn-active' : ''
                                    }`}
                                    onClick={() => setColumnAttrs({ valign: value })}
                                >
                                    <Icon size={13} />
                                </button>
                            ))}
                        </div>
                        <div className="ni-grid-toolbar-group">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    className="ni-grid-toolbar-chip"
                                    onClick={() => commitWidths(preset.percents)}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="ni-grid-toolbar-group">
                            <button
                                type="button"
                                className="ni-grid-toolbar-chip"
                                disabled={columnCount >= 4}
                                onClick={addColumn}
                                title="Add a column"
                            >
                                + Col
                            </button>
                            <button
                                type="button"
                                className="ni-grid-toolbar-chip"
                                disabled={columnCount <= 1}
                                onClick={removeColumn}
                                title="Remove the last column"
                            >
                                − Col
                            </button>
                        </div>
                    </div>
                )}

                {boundaries.map((x, i) => (
                    <span
                        key={i}
                        className="ni-grid-handle"
                        contentEditable={false}
                        data-ni-grid-handle=""
                        data-dragging={dragRef.current?.index === i + 1 ? 'true' : 'false'}
                        style={{ left: `${x}px` }}
                        title="Drag to resize columns (double-click to reset)"
                        onMouseDown={startDrag(i + 1)}
                        onDoubleClick={resetWidths}
                    />
                ))}

                {dragBadges?.map((badge, i) => (
                    <span
                        key={`badge-${i}`}
                        className="ni-grid-badge"
                        contentEditable={false}
                        style={{ left: `${badge.x}px` }}
                    >
                        {Math.round(badge.pct)}%
                    </span>
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
                style: 'margin:20px 0;',
            }),
            [
                'table',
                {
                    role: 'presentation',
                    width: '100%',
                    cellpadding: '0',
                    cellspacing: '0',
                    style: 'width:100%; border-collapse:separate; border-spacing:0;',
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

export const newsletterBlockExtensions = [NiBox, NiHighlight, NiStats, NiKeyDates, NiNumberedList, NiTitle, NiGrid, NiGridColumn, NiCta]

/** Node types whose double-click opens an attribute-editing dialog ('image' is the core image node). */
export const DIALOG_NODE_TYPES = ['niStats', 'niKeyDates', 'niNumberedList', 'niTitle', 'niCta', 'niBox', 'niHighlight', 'image'] as const

export type DialogNodeType = (typeof DIALOG_NODE_TYPES)[number]

export type BlockKind = 'box' | 'highlight' | 'stats' | 'keydates' | 'numberedlist' | 'title' | 'cta' | 'grid2' | 'grid3'

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
        case 'numberedlist':
            return { type: 'niNumberedList', attrs: { items: cloneNumbered(DEFAULT_NUMBERED_ITEMS) } }
        case 'title':
            return { type: 'niTitle', attrs: { title: DEFAULT_TITLE, label: DEFAULT_TITLE_LABEL } }
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
