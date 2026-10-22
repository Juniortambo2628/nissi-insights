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
import { Plus, Trash2 } from 'lucide-react'
import { DialogNodeType } from './newsletter-blocks'

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
    niCta: 'Edit Call to Action',
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
        }
    }

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>{TITLES[state.type]}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">{renderBody()}</div>
                <DialogFooter>
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
