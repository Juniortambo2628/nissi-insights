"use client"

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export interface RedirectFormData {
    from_path: string
    to: string
    status_code: number
    is_active: boolean
    priority: number
    notes: string
}

interface RedirectFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Partial<RedirectFormData>
    title?: string
    isLoading?: boolean
    onSubmit: (data: RedirectFormData) => void
    onCancel: () => void
}

const statusLabels: Record<number, string> = {
    301: 'Permanent (301)',
    302: 'Temporary (302)',
    307: 'Temporary (307)',
    308: 'Permanent (308)',
}

export function RedirectFormDialog({
    open,
    onOpenChange,
    initialData,
    title = 'New Redirect',
    isLoading = false,
    onSubmit,
    onCancel,
}: RedirectFormDialogProps) {
    const [form, setForm] = useState<RedirectFormData>({
        from_path: '',
        to: '',
        status_code: 301,
        is_active: true,
        priority: 0,
        notes: '',
    })

    useEffect(() => {
        if (open) {
            setForm({
                from_path: initialData?.from_path || '',
                to: initialData?.to || '',
                status_code: initialData?.status_code || 301,
                is_active: initialData?.is_active ?? true,
                priority: initialData?.priority ?? 0,
                notes: initialData?.notes || '',
            })
        }
    }, [open, initialData])

    const handleSubmit = () => {
        if (!form.from_path || !form.to) return
        onSubmit(form)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">From Path</label>
                        <Input
                            className="bg-background border-border text-foreground"
                            placeholder="/old-page or /old-page/"
                            value={form.from_path}
                            onChange={(e) => setForm({ ...form, from_path: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">To</label>
                        <Input
                            className="bg-background border-border text-foreground"
                            placeholder="/new-page or https://example.com/new-page"
                            value={form.to}
                            onChange={(e) => setForm({ ...form, to: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Status Code</label>
                        <Select
                            value={form.status_code.toString()}
                            onValueChange={(val) => setForm({ ...form, status_code: parseInt(val) })}
                        >
                            <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select status code" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(statusLabels).map(([code, label]) => (
                                    <SelectItem key={code} value={code}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Priority</label>
                        <Input
                            type="number"
                            min={0}
                            className="bg-background border-border text-foreground"
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value || '0') })}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                        <Input
                            className="bg-background border-border text-foreground"
                            placeholder="Why this redirect exists"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={form.is_active}
                            onCheckedChange={(checked: boolean) => setForm({ ...form, is_active: !!checked })}
                            id="redirect_is_active"
                            className="border-border"
                        />
                        <label htmlFor="redirect_is_active" className="text-sm font-medium text-muted-foreground">Active</label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !form.from_path || !form.to} className="gap-2">
                        {isLoading ? 'Saving...' : 'Save Redirect'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
