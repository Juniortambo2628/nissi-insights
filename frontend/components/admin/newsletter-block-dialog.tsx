"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { DialogNodeType, IMAGE_SHAPE_OPTIONS, IMAGE_FRAME_OPTIONS } from './newsletter-blocks'
import ImageUploader from './ImageUploader'
import { getMediaUrl } from '@/lib/utils'

const ALIGN_OPTIONS = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Centre' },
    { value: 'right', label: 'Right' },
]

const VALIGN_OPTIONS = [
    { value: 'top', label: 'Top' },
    { value: 'middle', label: 'Middle' },
    { value: 'bottom', label: 'Bottom' },
]

interface BlockAttrsDialogProps {
    state: { pos: number; type: DialogNodeType } | null
    editor: any
    onClose: () => void
}

const TITLES: Record<DialogNodeType, string> = {
    niBox: 'Edit Box',
    niHighlight: 'Edit Highlight',
    niStats: 'Edit Statistics',
    niKeyDates: 'Edit Key Dates',
    niNumberedList: 'Edit Numbered List',
    niTitle: 'Edit Section Title',
    niCta: 'Edit Call to Action',
    niTeam: 'Edit Team Members',
    image: 'Edit Image',
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-sm font-medium text-foreground/80">{children}</label>
)

const ListField = ({
    items,
    columns,
    onChange,
    onAdd,
    addLabel,
}: {
    items: any[]
    columns: { key: string; label: string; width?: string; placeholder?: string }[]
    onChange: (items: any[]) => void
    onAdd: () => void
    addLabel: string
}) => {
    const update = (index: number, key: string, value: string) => {
        const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        onChange(next)
    }

    const colStyle = (width?: string) =>
        width === '1fr' ? { flex: 1, minWidth: 0 } : { width }

    return (
        <div className="space-y-2">
            <div className="flex gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {columns.map((col) => (
                    <span key={String(col.key)} style={colStyle(col.width)}>{col.label}</span>
                ))}
            </div>
            {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                    {columns.map((col) => (
                        <Input
                            key={String(col.key)}
                            value={item[col.key] ?? ''}
                            placeholder={col.placeholder}
                            onChange={(e) => update(index, col.key, e.target.value)}
                            style={colStyle(col.width)}
                            className="bg-background border-border text-sm"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => onChange(items.filter((_, i) => i !== index))}
                        className="p-2 rounded border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors shrink-0"
                        title="Remove row"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:bg-secondary/20 transition-colors"
            >
                <Plus size={13} /> {addLabel}
            </button>
        </div>
    )
}

const BlockAttrsDialog = ({ state, editor, onClose }: BlockAttrsDialogProps) => {
    const [attrs, setAttrs] = React.useState<Record<string, any>>({})

    React.useEffect(() => {
        if (!state || !editor) return
        const node = editor.state.doc.nodeAt(state.pos)
        if (!node || node.type.name !== state.type) {
            onClose()
            return
        }
        const snapshot: Record<string, any> = { ...node.attrs }
        if (Array.isArray(snapshot.items)) {
            snapshot.items = snapshot.items.map((item: any) => ({ ...item }))
        }
        setAttrs(snapshot)
    }, [state, editor])

    if (!state) return null

    const set = (key: string, value: any) => setAttrs((prev) => ({ ...prev, [key]: value }))

    const save = () => {
        if (!editor) return onClose()
        editor
            .chain()
            .focus()
            .setNodeSelection(state.pos)
            .updateAttributes(state.type, attrs)
            .run()
        onClose()
    }

    const renderBody = () => {
        switch (state.type) {
            case 'niBox':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <FieldLabel>Label</FieldLabel>
                            <Input
                                value={attrs.label ?? ''}
                                onChange={(e) => set('label', e.target.value)}
                                className="bg-background border-border text-sm"
                                placeholder="e.g. Bulletin"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <FieldLabel>Horizontal</FieldLabel>
                                <Select
                                    value={attrs.align ?? 'left'}
                                    onValueChange={(value) => set('align', value)}
                                >
                                    <SelectTrigger className="h-9 bg-background border-border text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALIGN_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Vertical</FieldLabel>
                                <Select
                                    value={attrs.valign ?? 'top'}
                                    onValueChange={(value) => set('valign', value)}
                                >
                                    <SelectTrigger className="h-9 bg-background border-border text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VALIGN_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )
            case 'niHighlight':
                return (
                    <div className="space-y-1.5">
                        <FieldLabel>Label</FieldLabel>
                        <Input
                            value={attrs.label ?? ''}
                            onChange={(e) => set('label', e.target.value)}
                            className="bg-background border-border text-sm"
                            placeholder="e.g. Bulletin"
                        />
                    </div>
                )
            case 'niStats':
                return (
                    <div className="space-y-1.5">
                        <FieldLabel>Statistics</FieldLabel>
                        <ListField
                            items={attrs.items ?? []}
                            columns={[
                                { key: 'value', label: 'Value', width: '90px', placeholder: '14' },
                                { key: 'label', label: 'Label', width: '1fr', placeholder: 'Developments' },
                            ]}
                            onChange={(items) => set('items', items)}
                            onAdd={() => set('items', [...(attrs.items ?? []), { value: '', label: '' }])}
                            addLabel="Add statistic"
                        />
                    </div>
                )
            case 'niKeyDates':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <FieldLabel>Panel title</FieldLabel>
                            <Input
                                value={attrs.title ?? ''}
                                onChange={(e) => set('title', e.target.value)}
                                className="bg-background border-border text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Dates</FieldLabel>
                            <ListField
                                items={attrs.items ?? []}
                                columns={[
                                    { key: 'date', label: 'Date', width: '90px', placeholder: '29 Oct' },
                                    { key: 'flag', label: 'Flag', width: '60px', placeholder: '🇬🇧' },
                                    { key: 'text', label: 'Note', width: '1fr', placeholder: 'What happens on this date' },
                                ]}
                                onChange={(items) => set('items', items)}
                                onAdd={() => set('items', [...(attrs.items ?? []), { date: '', flag: '', text: '' }])}
                                addLabel="Add date"
                            />
                        </div>
                    </div>
                )
            case 'niNumberedList':
                return (
                    <div className="space-y-1.5">
                        <FieldLabel>Items</FieldLabel>
                        <ListField
                            items={attrs.items ?? []}
                            columns={[
                                { key: 'text', label: 'Text', width: '1fr', placeholder: 'What appears next to the number' },
                            ]}
                            onChange={(items) => set('items', items)}
                            onAdd={() => set('items', [...(attrs.items ?? []), { text: '' }])}
                            addLabel="Add item"
                        />
                    </div>
                )
            case 'niTitle':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <FieldLabel>Title</FieldLabel>
                            <Input
                                value={attrs.title ?? ''}
                                onChange={(e) => set('title', e.target.value)}
                                className="bg-background border-border text-sm"
                                placeholder="e.g. 🇰🇪 Kenya"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Label (right side)</FieldLabel>
                            <Input
                                value={attrs.label ?? ''}
                                onChange={(e) => set('label', e.target.value)}
                                className="bg-background border-border text-sm"
                                placeholder="e.g. 1 update"
                            />
                        </div>
                    </div>
                )
            case 'image':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <FieldLabel>Shape</FieldLabel>
                                <Select
                                    value={attrs.shape ?? 'square'}
                                    onValueChange={(value) => set('shape', value)}
                                >
                                    <SelectTrigger className="h-9 bg-background border-border text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {IMAGE_SHAPE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Frame</FieldLabel>
                                <Select
                                    value={attrs.frame ?? 'none'}
                                    onValueChange={(value) => set('frame', value)}
                                >
                                    <SelectTrigger className="h-9 bg-background border-border text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {IMAGE_FRAME_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Alt text</FieldLabel>
                            <Input
                                value={attrs.alt ?? ''}
                                onChange={(e) => set('alt', e.target.value)}
                                className="bg-background border-border text-sm"
                                placeholder="Describe the image"
                            />
                        </div>
                    </div>
                )
            case 'niCta':
                return (
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <FieldLabel>Heading</FieldLabel>
                            <Input
                                value={attrs.heading ?? ''}
                                onChange={(e) => set('heading', e.target.value)}
                                className="bg-background border-border text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Body</FieldLabel>
                            <Textarea
                                value={attrs.body ?? ''}
                                onChange={(e) => set('body', e.target.value)}
                                className="bg-background border-border text-sm min-h-[80px]"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <FieldLabel>Button text</FieldLabel>
                                <Input
                                    value={attrs.buttonText ?? ''}
                                    onChange={(e) => set('buttonText', e.target.value)}
                                    className="bg-background border-border text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Button URL</FieldLabel>
                                <Input
                                    value={attrs.buttonUrl ?? ''}
                                    onChange={(e) => set('buttonUrl', e.target.value)}
                                    className="bg-background border-border text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Footnote</FieldLabel>
                            <Textarea
                                value={attrs.note ?? ''}
                                onChange={(e) => set('note', e.target.value)}
                                className="bg-background border-border text-sm min-h-[60px]"
                                rows={2}
                            />
                        </div>
                    </div>
                )
            case 'niTeam':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <FieldLabel>Columns per row</FieldLabel>
                            <Select
                                value={String(attrs.columns ?? 2)}
                                onValueChange={(value) => set('columns', parseInt(value, 10))}
                            >
                                <SelectTrigger className="h-9 bg-background border-border text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 (full width)</SelectItem>
                                    <SelectItem value="2">2 side by side</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <FieldLabel>Members</FieldLabel>
                            {(attrs.items ?? []).map((member: any, index: number) => {
                                const updateRow = (key: string, value: string) =>
                                    set(
                                        'items',
                                        (attrs.items ?? []).map((item: any, i: number) =>
                                            i === index ? { ...item, [key]: value } : item
                                        )
                                    )
                                return (
                                    <div key={index} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                                        <div className="w-24 shrink-0">
                                            <ImageUploader
                                                value={member.imageUrl || ''}
                                                onChange={(url) => updateRow('imageUrl', url ? getMediaUrl(url) : '')}
                                                label="Photo"
                                                accept={['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']}
                                                maxSizeMB={3}
                                                className="[&_label]:mb-1 [&_label]:text-[11px]"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <Input
                                                value={member.name ?? ''}
                                                placeholder="Name"
                                                onChange={(e) => updateRow('name', e.target.value)}
                                                className="bg-background border-border text-sm"
                                            />
                                            <Input
                                                value={member.role ?? ''}
                                                placeholder="Role"
                                                onChange={(e) => updateRow('role', e.target.value)}
                                                className="bg-background border-border text-sm"
                                            />
                                            <Input
                                                value={member.email ?? ''}
                                                placeholder="Email"
                                                type="email"
                                                onChange={(e) => updateRow('email', e.target.value)}
                                                className="bg-background border-border text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                set('items', (attrs.items ?? []).filter((_: any, i: number) => i !== index))
                                            }
                                            className="p-2 rounded border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors shrink-0"
                                            title="Remove member"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )
                            })}
                            <button
                                type="button"
                                onClick={() =>
                                    set('items', [...(attrs.items ?? []), { imageUrl: '', name: '', role: '', email: '' }])
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:bg-secondary/20 transition-colors"
                            >
                                <Plus size={13} /> Add member
                            </button>
                        </div>
                    </div>
                )
        }
    }

    const fixedHeight = state.type === 'niStats' || state.type === 'niKeyDates' || state.type === 'niNumberedList' || state.type === 'niCta' || state.type === 'niTeam'

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent
                aria-describedby={undefined}
                className={`flex w-full max-w-xl flex-col gap-4 bg-background border-border text-foreground ${fixedHeight ? 'h-[78vh] overflow-hidden' : ''}`}
            >
                <DialogHeader className="shrink-0 pr-8">
                    <DialogTitle>{TITLES[state.type]}</DialogTitle>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto pr-1 space-y-4">{renderBody()}</div>
                <DialogFooter className="shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm border border-border/50 hover:bg-secondary/20"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Save
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { BlockAttrsDialog }
