"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useApi } from '@/hooks/use-api'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import { Newsletter, NewsletterRevision } from '@/types/api'
import { Loader2, RotateCcw, History, X } from 'lucide-react'

interface NewsletterHistoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsletterId: number | null
    onRestored: (newsletter: Newsletter) => void
}

const SOURCE_LABELS: Record<NewsletterRevision['source'], string> = {
    manual: 'Manual save',
    autosave: 'Autosave',
    restore: 'Before restore',
}

const NewsletterHistoryDialog = ({
    open,
    onOpenChange,
    newsletterId,
    onRestored,
}: NewsletterHistoryDialogProps) => {
    const { toast } = useToast()
    const { data: revisions, isLoading, isError } = useApi<NewsletterRevision[]>(
        open && newsletterId ? `/newsletters/${newsletterId}/revisions` : null
    )
    const [restoringId, setRestoringId] = useState<number | null>(null)

    const handleRestore = async (revision: NewsletterRevision) => {
        if (
            !confirm(
                'Restore this version? Your current version is saved to history first, so nothing is lost.'
            )
        )
            return

        setRestoringId(revision.id)
        try {
            const res = await api.post<Newsletter>(
                `/newsletters/${newsletterId}/revisions/${revision.id}/restore`
            )
            onRestored(res.data)
            toast({
                title: 'Version restored',
                description: 'The selected version is now open in the editor.',
            })
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Restore failed',
                description: err.response?.data?.message || 'Could not restore this version.',
            })
        } finally {
            setRestoringId(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="max-w-2xl bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History size={18} /> Version history
                    </DialogTitle>
                    <DialogDescription>
                        Every save is kept here. Restoring never discards your current version.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[55vh] overflow-y-auto -mx-1 px-1">
                    {isLoading ? (
                        <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin" size={16} /> Loading history...
                        </div>
                    ) : isError ? (
                        <p className="py-8 text-center text-sm text-destructive">
                            Could not load version history.
                        </p>
                    ) : revisions && revisions.length > 0 ? (
                        <ul className="divide-y divide-border/60">
                            {revisions.map((revision) => (
                                <li
                                    key={revision.id}
                                    className="flex items-start gap-3 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-medium text-foreground truncate">
                                                {revision.title || 'Untitled newsletter'}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground">
                                                {SOURCE_LABELS[revision.source] || revision.source}
                                            </span>
                                        </div>
                                        {revision.excerpt && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                {revision.excerpt}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-muted-foreground/70 mt-1">
                                            {new Date(revision.created_at).toLocaleString()}
                                            {revision.user ? ` · ${revision.user.name}` : ''}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 shrink-0 gap-1.5"
                                        disabled={restoringId !== null}
                                        onClick={() => handleRestore(revision)}
                                    >
                                        {restoringId === revision.id ? (
                                            <Loader2 size={13} className="animate-spin" />
                                        ) : (
                                            <RotateCcw size={13} />
                                        )}
                                        Restore
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="py-10 text-center text-sm text-muted-foreground">
                            No versions yet. Versions appear after your first save.
                        </p>
                    )}
                </div>

                <DialogFooter className="border-t border-border/50 pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
                        <X size={14} /> Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewsletterHistoryDialog
