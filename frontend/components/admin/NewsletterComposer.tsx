"use client"

import React from 'react'
import RichTextEditor from './RichTextEditor'
import { repairNewsletterHtml } from '@/lib/newsletter-repair'
import {
    NewsletterSection,
    splitNewsletterSections,
    joinNewsletterSections,
    sectionForKind,
    textSection,
    moveSection,
    duplicateSection,
    removeSection,
    insertSectionAt,
} from '@/lib/newsletter-sections'
import type { BlockKind } from './newsletter-blocks'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Plus,
    ArrowUp,
    ArrowDown,
    Copy,
    Trash2,
    Type,
    Square,
    Highlighter,
    BarChart3,
    CalendarClock,
    Heading3,
    ListOrdered,
    Users,
    Megaphone,
    Columns2,
    Columns3,
    Minus,
} from 'lucide-react'

interface NewsletterComposerProps {
    label?: string
    value: string
    onChange: (html: string) => void
    accentColor?: string
    textColor?: string
    backgroundColor?: string
    className?: string
}

type MenuKind = BlockKind | 'text' | 'divider'

const ADD_MENU: { kind: MenuKind; label: string; icon: React.ReactNode }[] = [
    { kind: 'text', label: 'Text', icon: <Type size={14} /> },
    { kind: 'box', label: 'Boxed section', icon: <Square size={14} /> },
    { kind: 'highlight', label: 'Impact highlight', icon: <Highlighter size={14} /> },
    { kind: 'stats', label: 'Statistics row', icon: <BarChart3 size={14} /> },
    { kind: 'keydates', label: 'Key dates panel', icon: <CalendarClock size={14} /> },
    { kind: 'title', label: 'Section title', icon: <Heading3 size={14} /> },
    { kind: 'numberedlist', label: 'Numbered list', icon: <ListOrdered size={14} /> },
    { kind: 'team', label: 'Team members', icon: <Users size={14} /> },
    { kind: 'cta', label: 'Call to action', icon: <Megaphone size={14} /> },
    { kind: 'grid2', label: 'Two columns', icon: <Columns2 size={14} /> },
    { kind: 'grid3', label: 'Three columns', icon: <Columns3 size={14} /> },
    { kind: 'divider', label: 'Divider', icon: <Minus size={14} /> },
]

const iconButton =
    'p-1.5 rounded border border-transparent text-muted-foreground hover:bg-background hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none'

/**
 * Section-based newsletter composer. The content stays a single HTML
 * string; on load it is split into cards (one per structured block, plus
 * grouped text runs) and joined back on every change. Each card is a full
 * RichTextEditor, so dblclick dialogs, the Edit-block button, grid drag
 * handles and autosave all keep working untouched.
 */
const NewsletterComposer = ({
    label,
    value,
    onChange,
    accentColor,
    textColor,
    backgroundColor,
    className,
}: NewsletterComposerProps) => {
    const [sections, setSections] = React.useState<NewsletterSection[] | null>(null)
    const lastEmitRef = React.useRef<string | null>(null)

    const emit = (next: NewsletterSection[]) => {
        const html = joinNewsletterSections(next)
        lastEmitRef.current = html
        setSections(next)
        onChange(html)
    }

    // Initial split, plus external changes (open, restore revision,
    // duplicate, template load). Repair only — structural normalisation is
    // not echoed back, mirroring RichTextEditor's load semantics, so
    // opening a newsletter never marks it dirty on its own.
    React.useEffect(() => {
        if (value === lastEmitRef.current) return
        const repaired = repairNewsletterHtml(value)
        const next = splitNewsletterSections(repaired)
        setSections(next)
        if (repaired !== value) {
            const html = joinNewsletterSections(next)
            lastEmitRef.current = html
            onChange(html)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const updateSectionHtml = (id: string, html: string) => {
        if (!sections) return
        emit(sections.map((section) => (section.id === id ? { ...section, html } : section)))
    }

    const handleDelete = (id: string) => {
        if (!sections) return
        if (!window.confirm('Delete this section?')) return
        const next = removeSection(sections, id)
        emit(next.length ? next : [textSection()])
    }

    const handleAdd = (afterIndex: number, kind: MenuKind) => {
        if (!sections) return
        emit(insertSectionAt(sections, afterIndex + 1, sectionForKind(kind)))
    }

    const addMenu = (afterIndex: number) => (
        <div className="flex justify-center py-0.5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full border border-dashed border-border/70 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
                        title="Add a section here"
                    >
                        <Plus size={13} /> Add section
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border-border text-foreground">
                    {ADD_MENU.map((item, index) => (
                        <React.Fragment key={item.kind}>
                            {index === 1 && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onSelect={() => handleAdd(afterIndex, item.kind)}
                            >
                                {item.icon} {item.label}
                            </DropdownMenuItem>
                        </React.Fragment>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

    return (
        <div className={`space-y-2 ${className || ''}`}>
            {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}

            {!sections ? (
                <div className="h-64 rounded-xl border border-border/50 bg-secondary/30 animate-pulse" />
            ) : (
                <div className="space-y-3">
                    {sections.map((section, index) => (
                        <React.Fragment key={section.id}>
                            <div className="rounded-xl border border-border/60 bg-background overflow-hidden shadow-sm">
                                <div className="flex items-center gap-2 border-b border-border/50 bg-secondary/40 px-3 py-1.5">
                                    <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        {section.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/60">#{index + 1}</span>
                                    <div className="flex-1" />
                                    <button
                                        type="button"
                                        className={iconButton}
                                        title="Move section up"
                                        disabled={index === 0}
                                        onClick={() => emit(moveSection(sections, section.id, 'up'))}
                                    >
                                        <ArrowUp size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        className={iconButton}
                                        title="Move section down"
                                        disabled={index === sections.length - 1}
                                        onClick={() => emit(moveSection(sections, section.id, 'down'))}
                                    >
                                        <ArrowDown size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        className={iconButton}
                                        title="Duplicate section"
                                        onClick={() => emit(duplicateSection(sections, section.id))}
                                    >
                                        <Copy size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        className={`${iconButton} hover:!text-destructive`}
                                        title="Delete section"
                                        onClick={() => handleDelete(section.id)}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                                <RichTextEditor
                                    value={section.html}
                                    onChange={(html) => updateSectionHtml(section.id, html)}
                                    accentColor={accentColor}
                                    textColor={textColor}
                                    backgroundColor={backgroundColor}
                                />
                            </div>
                            {addMenu(index)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}

export default NewsletterComposer
