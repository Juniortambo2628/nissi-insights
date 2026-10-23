"use client"

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getMediaUrl } from '@/lib/utils'
import { uploadImageFile, uploadErrorMessage } from '@/lib/upload-image'
import { repairNewsletterHtml } from '@/lib/newsletter-repair'
import { useToast } from '@/hooks/use-toast'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Link as LinkIcon,
    Unlink,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Image as ImageIcon,
    Loader2,
    Code,
    PenTool,
    Table as TableIcon,
    Minus,
    Square,
    BarChart3,
    Highlighter,
    Columns2,
    Columns3,
    CalendarClock,
    Megaphone,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    Baseline,
    ALargeSmall,
    Rows3,
    SlidersHorizontal,
    Heading3,
    Users,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useApi } from '@/hooks/use-api'
import { Insight } from '@/types/api'
import {
    buildBlockContent,
    DIALOG_NODE_TYPES,
    BlockKind,
    DialogNodeType,
} from './newsletter-blocks'
import { newsletterEditorExtensions } from './newsletter-editor-extensions'
import { BlockAttrsDialog } from './newsletter-block-dialog'

interface KnowledgeBaseItem {
    id: number
    title: string
    type: string
    is_published: boolean
    thumbnail: string | null
    slug?: string
    description?: string
}

interface ContentRefData {
    refType: 'insight' | 'resource'
    refId: number
    title: string
    excerpt: string
    imageUrl: string | null
    category: string
    url: string
}

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    label?: string
    className?: string
    /** Resolved live into var(--ni-accent) inside inserted newsletter blocks. */
    accentColor?: string
    textColor?: string
    backgroundColor?: string
}

interface ContentPickerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onInsert: (data: ContentRefData) => void
}

const ContentPickerDialog = ({ open, onOpenChange, onInsert }: ContentPickerDialogProps) => {
    const [tab, setTab] = React.useState<'insight' | 'resource'>('insight')
    const [search, setSearch] = React.useState('')
    const { data: insights } = useApi<Insight[]>(open ? '/insights' : null)
    const { data: resourcesRaw } = useApi<KnowledgeBaseItem[]>(open ? '/resources?all=true' : null)

    const resources = React.useMemo(
        () => resourcesRaw?.filter((r) => r.is_published) ?? [],
        [resourcesRaw]
    )
    const publishedInsights = React.useMemo(
        () => insights?.filter((i) => i.is_published) ?? [],
        [insights]
    )

    const items = tab === 'insight' ? publishedInsights : resources
    const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (item: any) => {
        const appUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || window.location.origin
        const imageUrl = item.image || item.thumbnail
            ? getMediaUrl(item.image || item.thumbnail)
            : null
        const category = item.category || item.type || ''
        const url = tab === 'insight'
            ? `${window.location.origin}/insights/${item.slug}`
            : `${window.location.origin}/knowledge-base/${item.slug}`
        const excerpt = (item.excerpt || item.description || '').replace(/<[^>]*>/g, '').slice(0, 200)

        onInsert({
            refType: tab,
            refId: item.id,
            title: item.title,
            excerpt,
            imageUrl,
            category,
            url,
        })
        onOpenChange(false)
        setSearch('')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[80vh] overflow-hidden bg-background border-border text-foreground flex flex-col">
                <DialogHeader>
                    <DialogTitle>Insert Content Reference</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setTab('insight')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            tab === 'insight'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border/50 text-muted-foreground hover:bg-secondary/20'
                        }`}
                    >
                        Insights
                    </button>
                    <button
                        onClick={() => setTab('resource')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            tab === 'resource'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border/50 text-muted-foreground hover:bg-secondary/20'
                        }`}
                    >
                        Resources
                    </button>
                </div>

                <div className="relative mb-3">
                    <Input
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-background border-border text-sm"
                    />
                </div>

                <div className="flex-1 overflow-y-auto border border-border/50 rounded-lg divide-y divide-border/30">
                    {filtered.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No published {tab === 'insight' ? 'insights' : 'resources'} found.
                        </div>
                    ) : (
                        filtered.map((item) => {
                            const thumb = (item as any).image || (item as any).thumbnail
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/20 transition-colors"
                                >
                                    {thumb ? (
                                        <img
                                            src={getMediaUrl(thumb)}
                                            alt=""
                                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0">
                                            <PenTool size={18} className="text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate text-foreground">{item.title}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {(item as any).category || (item as any).type || ''}
                                        </div>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>

                <DialogFooter>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 rounded-lg text-sm border border-border/50 hover:bg-secondary/20"
                    >
                        Cancel
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const TEXT_SWATCHES = ['#0f172a', '#dc2626', '#d97706', '#16a34a', '#2563eb', '#7c3aed', '#94a3b8', '#ffffff']

const FONT_SIZE_OPTIONS = [
    { value: null, label: 'Default' },
    { value: '11px', label: '11px' },
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '30px', label: '30px' },
]

const LINE_HEIGHT_OPTIONS = [
    { value: null, label: 'Default' },
    { value: '1', label: '100%' },
    { value: '1.15', label: '115%' },
    { value: '1.3', label: '130%' },
    { value: '1.5', label: '150%' },
    { value: '1.75', label: '175%' },
    { value: '2', label: '200%' },
]

const MenuBar = ({
    editor,
    onImageSelect,
    isUploading,
    onToggleSource,
    isSourceMode,
    onInsertContent,
    onInsertBlock,
    onInsertTable,
    onRunTableAction,
    onInsertDivider,
    accentColor,
    activeBlock,
    onEditBlock,
}: {
    editor: any
    onImageSelect: () => void
    isUploading: boolean
    onToggleSource: () => void
    isSourceMode: boolean
    onInsertContent: () => void
    onInsertBlock: (kind: BlockKind) => void
    onInsertTable: () => void
    onRunTableAction: (action: string) => void
    onInsertDivider: () => void
    accentColor?: string
    activeBlock: { pos: number; type: DialogNodeType } | null
    onEditBlock: () => void
}) => {
    if (!editor && !isSourceMode) return null

    const setLink = () => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const activeColor: string | undefined = editor?.isActive('textStyle')
        ? editor.getAttributes('textStyle').color
        : undefined
    const activeFontSize: string | null = editor?.getAttributes('textStyle').fontSize ?? null
    const activeLineHeight: string | null = editor?.getAttributes('textStyle').lineHeight ?? null
    const swatches = accentColor && !TEXT_SWATCHES.includes(accentColor)
        ? [accentColor, ...TEXT_SWATCHES]
        : TEXT_SWATCHES

    return (
        <div className="sticky top-0 z-20 flex flex-wrap gap-1 p-1 border-b border-border/50 bg-background rounded-t-lg">
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('bold') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Bold"
                disabled={isSourceMode}
            >
                <Bold size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('italic') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Italic"
                disabled={isSourceMode}
            >
                <Italic size={16} />
            </button>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 1 }).run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="H1"
                disabled={isSourceMode}
            >
                <Heading1 size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 2 }).run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="H2"
                disabled={isSourceMode}
            >
                <Heading2 size={16} />
            </button>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Bullet List"
                disabled={isSourceMode}
            >
                <List size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Ordered List"
                disabled={isSourceMode}
            >
                <ListOrdered size={16} />
            </button>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign('left').run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('textAlign', { align: 'left' }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Align Left"
                disabled={isSourceMode}
            >
                <AlignLeft size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign('center').run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('textAlign', { align: 'center' }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Align Center"
                disabled={isSourceMode}
            >
                <AlignCenter size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().setTextAlign('right').run() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('textAlign', { align: 'right' }) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Align Right"
                disabled={isSourceMode}
            >
                <AlignRight size={16} />
            </button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="relative p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-40"
                        disabled={isSourceMode || !editor}
                        title="Text color"
                    >
                        <Baseline size={16} />
                        {activeColor && (
                            <span
                                className="absolute bottom-0.5 left-1/2 h-[3px] w-3.5 -translate-x-1/2 rounded-full border border-black/10"
                                style={{ backgroundColor: activeColor }}
                            />
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 p-2 bg-background border-border text-foreground">
                    <div className="grid grid-cols-5 gap-1.5">
                        {swatches.map((color) => (
                            <button
                                key={color}
                                type="button"
                                title={color}
                                onClick={() => editor?.chain().focus().setColor(color).run()}
                                className={`h-6 w-6 rounded border transition-transform hover:scale-110 ${
                                    activeColor?.toLowerCase() === color.toLowerCase()
                                        ? 'border-primary ring-2 ring-primary/50'
                                        : 'border-black/10'
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/40">
                        <input
                            type="color"
                            value={activeColor || accentColor || '#0f172a'}
                            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                            aria-label="Custom text color"
                        />
                        <span className="text-xs text-muted-foreground">Custom color</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => editor?.chain().focus().unsetColor().run()}
                        className="w-full text-left px-1 py-1.5 mt-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                        Reset to default color
                    </button>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center gap-0.5 p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-40"
                        disabled={isSourceMode || !editor}
                        title="Text size"
                    >
                        <ALargeSmall size={16} />
                        <ChevronDown size={10} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32 bg-background border-border text-foreground">
                    {FONT_SIZE_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                            key={opt.value ?? 'default'}
                            className="gap-2 cursor-pointer justify-between"
                            onSelect={() => {
                                if (opt.value) editor?.chain().focus().setFontSize(opt.value).run()
                                else editor?.chain().focus().unsetFontSize().run()
                            }}
                        >
                            <span>{opt.label}</span>
                            {activeFontSize === opt.value && <span className="text-primary">✓</span>}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center gap-0.5 p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-40"
                        disabled={isSourceMode || !editor}
                        title="Line spacing"
                    >
                        <Rows3 size={16} />
                        <ChevronDown size={10} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32 bg-background border-border text-foreground">
                    {LINE_HEIGHT_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                            key={opt.value ?? 'default'}
                            className="gap-2 cursor-pointer justify-between"
                            onSelect={() => {
                                if (opt.value) editor?.chain().focus().setLineHeight(opt.value).run()
                                else editor?.chain().focus().unsetLineHeight().run()
                            }}
                        >
                            <span>{opt.label}</span>
                            {activeLineHeight === opt.value && <span className="text-primary">✓</span>}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); setLink() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${editor?.isActive('link') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title="Link"
                disabled={isSourceMode}
            >
                <LinkIcon size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().unsetLink().run() }}
                className="p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground"
                disabled={!editor?.isActive('link') || isSourceMode}
                title="Unlink"
            >
                <Unlink size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); if (!isUploading) onImageSelect() }}
                className="p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground"
                disabled={isUploading || isSourceMode}
                title="Insert Image"
            >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
            </button>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); onInsertContent() }}
                className="p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground"
                disabled={isSourceMode}
                title="Insert Content Reference (Insight / Resource card)"
            >
                <PenTool size={16} />
            </button>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); onInsertDivider() }}
                className="p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground"
                disabled={isSourceMode}
                title="Insert Divider"
            >
                <Minus size={16} />
            </button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center gap-0.5 p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-40"
                        disabled={isSourceMode || !editor}
                        title="Insert Block"
                    >
                        <Square size={16} />
                        <ChevronDown size={10} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border text-foreground">
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('box')}>
                        <Square size={14} /> Boxed section
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('highlight')}>
                        <Highlighter size={14} /> Impact highlight
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('stats')}>
                        <BarChart3 size={14} /> Statistics row
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('keydates')}>
                        <CalendarClock size={14} /> Key dates panel
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('cta')}>
                        <Megaphone size={14} /> Call to action
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('title')}>
                        <Heading3 size={14} /> Section title
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('numberedlist')}>
                        <ListOrdered size={14} /> Numbered list
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('team')}>
                        <Users size={14} /> Team members
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('grid2')}>
                        <Columns2 size={14} /> Two columns
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => onInsertBlock('grid3')}>
                        <Columns3 size={14} /> Three columns
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {activeBlock && (
                <button
                    onClick={(e) => { e.preventDefault(); onEditBlock() }}
                    className="flex items-center gap-1.5 px-2 py-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-40"
                    disabled={isSourceMode}
                    title="Edit the selected block"
                >
                    <SlidersHorizontal size={16} />
                    <span className="text-xs font-medium">Edit block</span>
                </button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center gap-0.5 p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-40"
                        disabled={isSourceMode || !editor}
                        title={editor?.isActive('table') ? 'Table Options' : 'Insert Table'}
                    >
                        <TableIcon size={16} />
                        <ChevronDown size={10} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border text-foreground">
                    {editor?.isActive('table') ? (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onRunTableAction('rowAbove')}>Add row above</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onRunTableAction('rowBelow')}>Add row below</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onRunTableAction('colBefore')}>Add column before</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onRunTableAction('colAfter')}>Add column after</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onRunTableAction('deleteRow')}>Delete row</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => onRunTableAction('deleteColumn')}>Delete column</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive" onSelect={() => onRunTableAction('deleteTable')}>Delete table</DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuItem className="cursor-pointer" onSelect={onInsertTable}>Insert 3 × 3 table</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex-1" />
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().undo().run() }}
                className="p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground"
                title="Undo"
                disabled={isSourceMode}
            >
                <Undo size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor?.chain().focus().redo().run() }}
                className="p-2 rounded hover:bg-secondary/80 transition-colors text-muted-foreground"
                title="Redo"
                disabled={isSourceMode}
            >
                <Redo size={16} />
            </button>
            <div className="w-[1px] h-6 bg-border/50 self-center mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); onToggleSource() }}
                className={`p-2 rounded hover:bg-secondary/80 transition-colors ${isSourceMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                title={isSourceMode ? 'Switch to visual editor' : 'Edit HTML source'}
            >
                <Code size={16} />
            </button>
        </div>
    )
}

const RichTextEditor = ({
    value,
    onChange,
    label,
    className,
    accentColor,
    textColor,
    backgroundColor,
}: RichTextEditorProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const [isSourceMode, setIsSourceMode] = React.useState(false)
    const [sourceText, setSourceText] = React.useState('')
    const [showContentPicker, setShowContentPicker] = React.useState(false)
    const [dialogState, setDialogState] = React.useState<{ pos: number; type: DialogNodeType } | null>(null)
    const [activeBlock, setActiveBlock] = React.useState<{ pos: number; type: DialogNodeType } | null>(null)
    const { toast } = useToast()

    // Last HTML this component handed to onChange. The value-sync effect
    // skips values equal to it (our own echo — already clean, so typing
    // never re-parses) and repairs everything that arrives from outside
    // (load, restore, duplicate, source mode).
    const lastEmitRef = React.useRef<string | null>(null)
    const emit = (html: string) => {
        lastEmitRef.current = html
        onChange(html)
    }

    const editor = useEditor({
        immediatelyRender: false,
        extensions: newsletterEditorExtensions,
        content: value,
        editorProps: {
            // Flatten nested-table / block-in-table structures coming from
            // pasted email or Word HTML before they ever land in the doc.
            transformPastedHTML: (html: string) => repairNewsletterHtml(html),
            handleDoubleClick: (view, _pos, event) => {
                const target = event.target as HTMLElement | null
                const onLabel = !!target?.closest('[data-ni-box-label],[data-ni-highlight-label]')
                const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
                if (!coords) return false

                const dialogTypes = DIALOG_NODE_TYPES as readonly string[]
                const isDialogNode = (n: any) => !!n && dialogTypes.includes(n.type.name)

                // Label clicks always mean "edit the box / highlight", even
                // when the coordinates resolve to the box's first child.
                if (onLabel) {
                    const $label = view.state.doc.resolve(coords.pos)
                    for (let depth = $label.depth; depth > 0; depth--) {
                        const name = $label.node(depth).type.name
                        if (name === 'niBox' || name === 'niHighlight') {
                            setDialogState({ pos: $label.before(depth), type: name as DialogNodeType })
                            return true
                        }
                    }
                    const before = coords.pos > 0 ? view.state.doc.nodeAt(coords.pos - 1) : null
                    if (before && (before.type.name === 'niBox' || before.type.name === 'niHighlight')) {
                        setDialogState({ pos: coords.pos - 1, type: before.type.name as DialogNodeType })
                        return true
                    }
                    return false
                }

                let type: string | null = null
                let pos = -1

                // Leaf / atom nodes (images, stats, key dates…) sit directly at
                // the click position rather than containing it — check those
                // first so a block nested inside a boxed section still opens
                // its own dialog instead of the box's.
                const nodeHere = view.state.doc.nodeAt(coords.pos)
                const nodeBefore = coords.pos > 0 ? view.state.doc.nodeAt(coords.pos - 1) : null
                if (nodeHere && isDialogNode(nodeHere)) {
                    type = nodeHere.type.name
                    pos = coords.pos
                } else if (nodeBefore && isDialogNode(nodeBefore)) {
                    type = nodeBefore.type.name
                    pos = coords.pos - 1
                }

                // Otherwise walk outwards to the innermost dialog node
                // containing the click position.
                if (!type) {
                    const $from = view.state.doc.resolve(coords.pos)
                    for (let depth = $from.depth; depth > 0; depth--) {
                        const name = $from.node(depth).type.name
                        if (dialogTypes.includes(name)) {
                            type = name
                            pos = $from.before(depth)
                            break
                        }
                    }
                }

                if (!type) return false
                if ((type === 'niBox' || type === 'niHighlight') && !onLabel) return false

                setDialogState({ pos, type: type as DialogNodeType })
                return true
            },
        },
        onUpdate: ({ editor }) => {
            if (!isSourceMode) {
                emit(editor.getHTML())
            }
        },
    })

    // Track the innermost dialog-capable node at the selection so the
    // toolbar can offer an explicit "Edit block" button (statistics items
    // and other atoms are easy to miss otherwise).
    React.useEffect(() => {
        if (!editor) return
        const computeActiveBlock = () => {
            const { selection } = editor.state
            const dialogTypes = DIALOG_NODE_TYPES as readonly string[]
            const selNode: any = (selection as any).node
            let type: string | null = null
            let pos = -1

            if (selNode && dialogTypes.includes(selNode.type.name)) {
                type = selNode.type.name
                pos = selection.from
            } else {
                const $from = selection.$from
                for (let depth = $from.depth; depth > 0; depth--) {
                    const name = $from.node(depth).type.name
                    if (dialogTypes.includes(name)) {
                        type = name
                        pos = $from.before(depth)
                        break
                    }
                }
            }
            setActiveBlock(type ? { pos, type: type as DialogNodeType } : null)
        }
        computeActiveBlock()
        editor.on('selectionUpdate', computeActiveBlock)
        return () => {
            editor.off('selectionUpdate', computeActiveBlock)
        }
    }, [editor])

    // Update content if value changes externally (e.g. on load). Values
    // that contain nested tables or blocks trapped in tables are repaired
    // first — the repair is idempotent, so echoing the fixed HTML back
    // through onChange converges without a loop.
    React.useEffect(() => {
        if (!editor || isSourceMode) return
        // Our own echo: the editor already holds this exact content.
        if (value === lastEmitRef.current) return
        const repaired = repairNewsletterHtml(value)
        if (repaired !== value) {
            emit(repaired)
            editor.commands.setContent(repaired)
            return
        }
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    const toggleSourceMode = () => {
        if (!isSourceMode) {
            // Switching to source mode: capture current HTML
            const html = editor?.getHTML() || value
            setSourceText(html)
            setIsSourceMode(true)
        } else {
            // Switching back to visual mode: parse the HTML (repairing any
            // nested tables typed into source mode on the way out).
            if (editor) {
                editor.commands.setContent(repairNewsletterHtml(sourceText))
                emit(editor.getHTML())
            }
            setIsSourceMode(false)
        }
    }

    const handleSourceChange = (text: string) => {
        setSourceText(text)
        emit(text)
    }

    const insertContentRef = (data: ContentRefData) => {
        if (!editor) return
        editor
            .chain()
            .focus()
            .insertContent({
                type: 'contentReference',
                attrs: data,
            })
            .run()
    }

    const insertBlock = (kind: BlockKind) => {
        editor?.chain().focus().insertContent(buildBlockContent(kind)).run()
    }

    const insertTable = () => {
        if (!editor) return
        // Guard: never insert a table inside another table — that is how
        // newsletters ended up as stacked nested tables. Use a box or a
        // two-column layout for structure instead.
        const { $from } = editor.state.selection
        for (let depth = $from.depth; depth > 0; depth--) {
            if ($from.node(depth).type.name === 'table') return
        }
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }

    const insertDivider = () => {
        editor?.chain().focus().setHorizontalRule().run()
    }

    const runTableAction = (action: string) => {
        if (!editor) return
        const chain = editor.chain().focus()
        switch (action) {
            case 'rowAbove': chain.addRowBefore(); break
            case 'rowBelow': chain.addRowAfter(); break
            case 'colBefore': chain.addColumnBefore(); break
            case 'colAfter': chain.addColumnAfter(); break
            case 'deleteRow': chain.deleteRow(); break
            case 'deleteColumn': chain.deleteColumn(); break
            case 'deleteTable': chain.deleteTable(); break
        }
        chain.run()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file || !editor) return

        setIsUploading(true)
        try {
            const { src, alt } = await uploadImageFile(file)

            editor
                .chain()
                .focus()
                .setImage({ src, alt })
                .run()
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: uploadErrorMessage(err),
            })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className={`space-y-2 ${className || ''}`}>
            {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <div
                className="border border-border/50 rounded-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-background/50"
                style={{
                    '--ni-accent': accentColor || '#2563eb',
                    '--ni-text': textColor || '#0f172a',
                    '--ni-bg': backgroundColor || '#ffffff',
                } as React.CSSProperties}
            >
                <MenuBar
                    editor={editor}
                    isUploading={isUploading}
                    onImageSelect={() => fileInputRef.current?.click()}
                    onToggleSource={toggleSourceMode}
                    isSourceMode={isSourceMode}
                    onInsertContent={() => setShowContentPicker(true)}
                    onInsertBlock={insertBlock}
                    onInsertTable={insertTable}
                    onRunTableAction={runTableAction}
                    onInsertDivider={insertDivider}
                    accentColor={accentColor}
                    activeBlock={activeBlock}
                    onEditBlock={() => {
                        if (activeBlock) setDialogState(activeBlock)
                    }}
                />
                {isSourceMode ? (
                    <div className="p-0">
                        <textarea
                            value={sourceText}
                            onChange={(e) => handleSourceChange(e.target.value)}
                            className="w-full min-h-[300px] p-4 font-mono text-sm bg-background/50 text-foreground resize-y focus:outline-none"
                            placeholder="<p>Paste your HTML here...</p>"
                            spellCheck={false}
                        />
                        <div className="px-4 py-2 border-t border-border/50 text-[11px] text-muted-foreground">
                            HTML source mode — paste or edit raw HTML. Click the &lt;/&gt; button to return to the visual editor.
                        </div>
                    </div>
                ) : (
                    <EditorContent
                        editor={editor}
                        className="ni-editor prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none prose-img:max-w-full"
                    />
                )}
            </div>

            <ContentPickerDialog
                open={showContentPicker}
                onOpenChange={setShowContentPicker}
                onInsert={insertContentRef}
            />

            <BlockAttrsDialog
                state={dialogState}
                editor={editor}
                onClose={() => setDialogState(null)}
            />
        </div>
    )
}

export default RichTextEditor
