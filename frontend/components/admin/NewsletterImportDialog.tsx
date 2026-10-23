"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
    CLAUDE_NEWSLETTER_INSTRUCTIONS,
    ImportedNewsletter,
    isHtmlFile,
    prepareImportedNewsletter,
    readHtmlFile,
} from '@/lib/newsletter-import'
import { AlertTriangle, CheckCircle2, ClipboardCopy, FileUp, ImageIcon, LayoutList } from 'lucide-react'

export type ImportMode = 'replace' | 'append'

interface NewsletterImportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** A file dropped elsewhere (e.g. the empty-content drop zone). */
    initialFile?: File | null
    hasExistingContent: boolean
    onImport: (result: ImportedNewsletter, mode: ImportMode) => void
}

/**
 * Upload (or paste) the HTML file Claude produced and load it into the
 * composer — no source mode needed. Shows what was found (sections,
 * images to upload, detected title) before anything is replaced.
 */
const NewsletterImportDialog = ({
    open,
    onOpenChange,
    initialFile,
    hasExistingContent,
    onImport,
}: NewsletterImportDialogProps) => {
    const { toast } = useToast()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [result, setResult] = React.useState<ImportedNewsletter | null>(null)
    const [sourceName, setSourceName] = React.useState('')
    const [pasted, setPasted] = React.useState('')
    const [showPaste, setShowPaste] = React.useState(false)
    const [dragging, setDragging] = React.useState(false)
    const [mode, setMode] = React.useState<ImportMode>('replace')
    const [error, setError] = React.useState('')

    const reset = () => {
        setResult(null)
        setSourceName('')
        setPasted('')
        setShowPaste(false)
        setDragging(false)
        setMode('replace')
        setError('')
    }

    const analyse = (raw: string, name: string) => {
        const prepared = prepareImportedNewsletter(raw)
        if (prepared.isEmpty) {
            setResult(null)
            setError(`${name} has no newsletter content in it. Check you uploaded the right file.`)
            return
        }
        setError('')
        setSourceName(name)
        setResult(prepared)
    }

    const loadFile = async (file: File) => {
        if (!isHtmlFile(file)) {
            setResult(null)
            setError(`"${file.name}" is not an HTML file. Upload the .html file Claude gave you.`)
            return
        }
        try {
            analyse(await readHtmlFile(file), file.name)
        } catch {
            setError('Could not read that file. Please try again.')
        }
    }

    React.useEffect(() => {
        if (!open) {
            reset()
            return
        }
        if (initialFile) void loadFile(initialFile)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialFile])

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files?.[0]
        if (file) void loadFile(file)
    }

    const copyInstructions = async () => {
        try {
            await navigator.clipboard.writeText(CLAUDE_NEWSLETTER_INSTRUCTIONS)
            toast({ title: 'Instructions copied', description: 'Paste them into Claude along with this week\'s notes.' })
        } catch {
            toast({ variant: 'destructive', title: 'Copy failed', description: 'Your browser blocked the clipboard.' })
        }
    }

    const confirmImport = () => {
        if (!result) return
        onImport(result, hasExistingContent ? mode : 'replace')
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>Import newsletter from Claude</DialogTitle>
                    <DialogDescription>
                        Upload the HTML file Claude made for you. Every section, box and image placeholder is
                        loaded into the editor, ready for you to review and add photos.
                    </DialogDescription>
                </DialogHeader>

                <input
                    ref={inputRef}
                    type="file"
                    accept=".html,.htm,.txt,text/html"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ''
                        if (file) void loadFile(file)
                    }}
                />

                {!result ? (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                                dragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/70 hover:border-primary/60 hover:bg-secondary/30'
                            }`}
                        >
                            <FileUp size={32} className="text-primary" />
                            <span className="text-sm font-semibold">Drop the .html file here, or click to choose it</span>
                            <span className="text-xs text-muted-foreground">The file Claude gave you, e.g. energy-law-brief.html</span>
                        </button>

                        {showPaste ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={pasted}
                                    onChange={(e) => setPasted(e.target.value)}
                                    placeholder="Paste the HTML Claude gave you here"
                                    className="min-h-[160px] font-mono text-xs"
                                    spellCheck={false}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!pasted.trim()}
                                    onClick={() => analyse(pasted, 'The pasted HTML')}
                                >
                                    Use pasted HTML
                                </Button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                                onClick={() => setShowPaste(true)}
                            >
                                Claude gave you the code in the chat instead? Paste it here
                            </button>
                        )}

                        {error && (
                            <p className="flex items-start gap-2 text-sm text-destructive">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                            <p className="flex items-center gap-2 text-sm font-semibold">
                                <CheckCircle2 size={16} className="text-emerald-500" /> {sourceName} is ready to import
                            </p>
                            {result.title && (
                                <p className="text-sm text-muted-foreground">
                                    Title: <span className="text-foreground">{result.title}</span>
                                </p>
                            )}
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <LayoutList size={14} /> {result.blockCount} newsletter block{result.blockCount === 1 ? '' : 's'}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ImageIcon size={14} /> {result.imageCount} image{result.imageCount === 1 ? '' : 's'}.
                                After importing, click <strong>Upload image</strong> on each dashed image box to add the photos.
                            </p>
                            {result.blockCount === 0 && (
                                <p className="flex items-start gap-2 text-sm text-amber-600">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                    This file doesn&apos;t use the newsletter blocks, so it will import as plain text.
                                    Use &quot;Copy instructions for Claude&quot; below and ask Claude to redo it.
                                </p>
                            )}
                        </div>

                        {hasExistingContent && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">This newsletter already has content.</p>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" name="import-mode" checked={mode === 'replace'} onChange={() => setMode('replace')} />
                                    Replace everything with the imported newsletter
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" name="import-mode" checked={mode === 'append'} onChange={() => setMode('append')} />
                                    Add it to the end of the current content
                                </label>
                            </div>
                        )}

                        <button
                            type="button"
                            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                            onClick={reset}
                        >
                            Choose a different file
                        </button>
                    </div>
                )}

                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={copyInstructions}>
                        <ClipboardCopy size={14} /> Copy instructions for Claude
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={confirmImport} disabled={!result}>
                            {hasExistingContent && mode === 'replace' ? 'Replace content' : 'Import newsletter'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewsletterImportDialog
