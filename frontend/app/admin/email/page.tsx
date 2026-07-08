"use client"

import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Loader2, Mail, Eye, Code, CheckCircle2, AlertCircle, Sparkles, Layout, Send, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import api from '@/lib/api'
import { EmailTemplate, EmailLog } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface MailHealth {
    mailer: string
    from_address: string
    smtp_host: string
    smtp_port: number
    smtp_encryption: string
    smtp_reachable: boolean | null
    smtp_error: string | null
    is_log_driver: boolean
    warning: string | null
    domain: string | null
    deliverability_guidance: string[]
}

const SYSTEM_TEMPLATES = [
    'event_registered_client',
    'event_registered_admin',
    'event_reminder_approaching',
    'event_reminder_started',
    'event_thank_you_ended',
    'event_attended_thank_you',
    'consultation_request_user',
    'consultation_request_admin',
    'rsvp_confirmation',
    'subscriber_welcome',
    'content_update_notification',
    'password_reset',
]

const VARIABLES = [
    // Person
    { label: 'Name', value: '{{ $name }}', group: 'Person' },
    { label: 'First Name', value: '{{ $first_name }}', group: 'Person' },
    { label: 'Last Name', value: '{{ $last_name }}', group: 'Person' },
    { label: 'Email', value: '{{ $email }}', group: 'Person' },
    { label: 'Phone', value: '{{ $phone }}', group: 'Person' },
    { label: 'Organization', value: '{{ $organization }}', group: 'Person' },

    // Consultation
    { label: 'Subject', value: '{{ $requestData->subject ?? \'General Inquiry\' }}', group: 'Consultation' },
    { label: 'Message', value: '{{ $requestData->message }}', group: 'Consultation' },
    { label: 'First Name (req)', value: '{{ $requestData->first_name }}', group: 'Consultation' },
    { label: 'Last Name (req)', value: '{{ $requestData->last_name }}', group: 'Consultation' },

    // RSVP
    { label: 'RSVP Name', value: '{{ $rsvp->name }}', group: 'RSVP' },
    { label: 'RSVP Email', value: '{{ $rsvp->email }}', group: 'RSVP' },
    { label: 'RSVP Company', value: '{{ $rsvp->company ?? \'—\' }}', group: 'RSVP' },
    { label: 'RSVP Job Title', value: '{{ $rsvp->job_title ?? \'—\' }}', group: 'RSVP' },
    { label: 'RSVP Sector', value: '{{ $rsvp->sector ?? \'—\' }}', group: 'RSVP' },
    { label: 'RSVP Interest', value: '{{ $rsvp->interest ?? \'—\' }}', group: 'RSVP' },

    // Subscriber
    { label: 'Subscriber Name', value: '{{ $subscriber->name ?? \'there\' }}', group: 'Subscriber' },
    { label: 'Subscriber Email', value: '{{ $subscriber->email }}', group: 'Subscriber' },

    // Events
    { label: 'Event Title', value: '{{ $eventTitle }}', group: 'Event' },
    { label: 'Event Date', value: '{{ $eventDate }}', group: 'Event' },
    { label: 'Event Time', value: '{{ $eventTime }}', group: 'Event' },
    { label: 'Event Location', value: '{{ $eventLocation }}', group: 'Event' },
    { label: 'Event Link', value: '{{ $eventLink }}', group: 'Event' },
    { label: 'Event ID', value: '{{ $eventId }}', group: 'Event' },

    // Content update
    { label: 'Content Type', value: '{{ $typeLabel }}', group: 'Content' },
    { label: 'Category', value: '{{ $categoryLabel }}', group: 'Content' },
    { label: 'Title', value: '{{ $title }}', group: 'Content' },
    { label: 'Excerpt', value: '{{ $excerpt }}', group: 'Content' },
    { label: 'URL', value: '{{ $url }}', group: 'Content' },
    { label: 'Image URL', value: '{{ $imageUrl }}', group: 'Content' },

    // Password reset
    { label: 'Reset URL', value: '{{ $resetUrl }}', group: 'Password' },
    { label: 'Expiry (mins)', value: '{{ $expireCount }}', group: 'Password' },

    // App
    { label: 'App Name', value: "{{ config('app.name') }}", group: 'App' },
    { label: 'Frontend URL', value: "{{ config('app.frontend_url') }}", group: 'App' },
]

const VARIABLE_GROUPS = Array.from(new Set(VARIABLES.map(v => v.group)))

const EmailSettingsPage = () => {
    const { toast } = useToast()
    const { data: templates, isLoading, mutate: mutateTemplates } = useApi<EmailTemplate[]>('/email-templates')
    const { data: logs, mutate: mutateLogs } = useApi<{ data: EmailLog[], meta: any }>('/email-logs')
    const { data: summary, mutate: mutateSummary } = useApi<{ sent: number, failed: number, total: number }>('/email-logs/summary')
    const { data: mailHealth, mutate: mutateMailHealth } = useApi<MailHealth>('/email-templates/health')

    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
    const [form, setForm] = useState({ name: '', subject: '', body: '', variables: [] as string[], is_active: true })
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual')
    const [previewHtml, setPreviewHtml] = useState<string>('')
    const [previewSubject, setPreviewSubject] = useState<string>('')
    const [isPreviewLoading, setIsPreviewLoading] = useState(false)
    const [previewError, setPreviewError] = useState<string | null>(null)
    const [testEmail, setTestEmail] = useState('')
    const [isSendingTest, setIsSendingTest] = useState(false)
    const [activeTab, setActiveTab] = useState('editor')
    const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (templates && templates.length > 0 && !selectedTemplate) {
            setSelectedTemplate(templates[0])
        }
    }, [templates, selectedTemplate])

    useEffect(() => {
        if (selectedTemplate) {
            setForm({
                name: selectedTemplate.name,
                subject: selectedTemplate.subject,
                body: selectedTemplate.body,
                variables: selectedTemplate.variables || [],
                is_active: selectedTemplate.is_active,
            })
            handlePreview(selectedTemplate.subject, selectedTemplate.body)
        }
    }, [selectedTemplate?.id])

    const handlePreview = async (subject = form.subject, body = form.body) => {
        if (!selectedTemplate || !body) return
        setIsPreviewLoading(true)
        setPreviewError(null)
        try {
            const response = await api.post('/email-templates/preview', {
                template_id: selectedTemplate.id,
                content: body,
                subject,
            })
            setPreviewHtml(response.data.html)
            setPreviewSubject(response.data.subject)
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to render preview'
            setPreviewError(message)
            toast({ title: 'Preview Error', description: message, variant: 'destructive' })
        } finally {
            setIsPreviewLoading(false)
        }
    }

    const handleSave = async () => {
        if (!selectedTemplate) return
        setIsSaving(true)
        setSaveSuccess(false)
        try {
            await api.put(`/email-templates/${selectedTemplate.id}`, form)
            mutateTemplates()
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
            toast({ title: "Template Saved", description: `${form.name} has been updated.` })
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to save template.", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    const handleSendTest = async () => {
        if (!selectedTemplate || !testEmail) return
        setIsSendingTest(true)
        try {
            await api.post('/email-templates/send-test', {
                template_id: selectedTemplate.id,
                to: testEmail,
            })
            toast({ title: "Test Email Sent", description: `A test email was sent to ${testEmail}.` })
            mutateLogs()
            mutateSummary()
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.error || "Failed to send test email.", variant: "destructive" })
        } finally {
            setIsSendingTest(false)
        }
    }

    const insertVariable = (variable: string, field: 'subject' | 'body') => {
        if (field === 'subject') {
            const input = document.getElementById('subject-input') as HTMLInputElement | null
            if (input) {
                const start = input.selectionStart || 0
                const end = input.selectionEnd || 0
                const newValue = form.subject.slice(0, start) + variable + form.subject.slice(end)
                setForm(prev => ({ ...prev, subject: newValue }))
                setTimeout(() => {
                    input.focus()
                    input.setSelectionRange(start + variable.length, start + variable.length)
                }, 0)
            } else {
                setForm(prev => ({ ...prev, subject: prev.subject + ' ' + variable }))
            }
            return
        }

        if (editorMode === 'code') {
            const textarea = bodyTextareaRef.current
            if (textarea) {
                const start = textarea.selectionStart || 0
                const end = textarea.selectionEnd || 0
                const newValue = form.body.slice(0, start) + variable + form.body.slice(end)
                setForm(prev => ({ ...prev, body: newValue }))
                setTimeout(() => {
                    textarea.focus()
                    textarea.setSelectionRange(start + variable.length, start + variable.length)
                }, 0)
            } else {
                setForm(prev => ({ ...prev, body: prev.body + ' ' + variable }))
            }
        } else {
            // Visual editor: append for simplicity (RichTextEditor would need a ref for cursor insertion)
            setForm(prev => ({ ...prev, body: prev.body + ' ' + variable }))
            toast({ title: 'Variable Added', description: 'Switch to Code mode to insert at a specific cursor position.' })
        }
    }

    const filteredVariables = React.useMemo(() => {
        if (!selectedTemplate?.variables?.length) return VARIABLES
        return VARIABLES.filter(v =>
            selectedTemplate.variables?.includes(v.label) ||
            selectedTemplate.variables?.some((varName: string) => v.value.includes(varName))
        )
    }, [selectedTemplate])

    const variablesByGroup = React.useMemo(() => {
        const vars = filteredVariables
        return VARIABLE_GROUPS.map(group => ({
            group,
            variables: vars.filter(v => v.group === group),
        })).filter(g => g.variables.length > 0)
    }, [filteredVariables])

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            Email Configuration
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">Templates</Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Customize and test automated emails.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {summary && (
                            <div className="hidden md:flex items-center gap-3 text-xs">
                                <span className="text-muted-foreground">Sent: <strong className="text-emerald-500">{summary.sent}</strong></span>
                                <span className="text-muted-foreground">Failed: <strong className="text-red-500">{summary.failed}</strong></span>
                            </div>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !selectedTemplate}
                            className={`gap-2 px-6 font-bold transition-all ${saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90 text-white'}`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saveSuccess ? 'Saved!' : 'Save changes'}
                        </Button>
                    </div>
                </div>

                {mailHealth && (
                    <Card className={`border ${mailHealth.is_log_driver || mailHealth.smtp_reachable === false ? 'border-red-200 bg-red-500/5' : 'border-border bg-secondary/5'}`}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    {mailHealth.is_log_driver || mailHealth.smtp_reachable === false ? (
                                        <AlertCircle size={16} className="text-red-500" />
                                    ) : (
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    )}
                                    Mail Delivery Status
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="gap-1" onClick={() => mutateMailHealth()}>
                                    <RefreshCw size={12} />
                                    Check
                                </Button>
                            </div>
                            <CardDescription className="text-xs">
                                {mailHealth.is_log_driver
                                    ? 'MAIL_MAILER is set to log. Emails are NOT being delivered.'
                                    : mailHealth.smtp_reachable === false
                                        ? `Cannot reach SMTP server: ${mailHealth.smtp_error || 'Unknown error'}`
                                        : `Using ${mailHealth.mailer} via ${mailHealth.smtp_host}:${mailHealth.smtp_port}.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-2 text-xs">
                                <Badge variant="outline">From: {mailHealth.from_address}</Badge>
                                <Badge variant="outline">Host: {mailHealth.smtp_host}</Badge>
                                <Badge variant="outline">Port: {mailHealth.smtp_port}</Badge>
                                <Badge variant="outline">Encryption: {mailHealth.smtp_encryption || 'none'}</Badge>
                            </div>
                            {mailHealth.deliverability_guidance.length > 0 && (
                                <div className="bg-background/50 rounded-lg p-3 space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground">Deliverability Guidance</p>
                                    <ul className="space-y-1">
                                        {mailHealth.deliverability_guidance.map((tip, i) => (
                                            <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                                                <span className="text-primary mt-0.5">•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Left Panel: Template List */}
                    <div className="xl:col-span-1 space-y-4">
                        <Card className="bg-secondary/5 border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-foreground">Templates</CardTitle>
                                <CardDescription className="text-xs">Select a template to edit.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="p-4 space-y-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-secondary/20 rounded animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/30">
                                        {templates?.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template)}
                                                className={`w-full text-left px-4 py-3 transition-colors ${selectedTemplate?.id === template.id ? 'bg-primary/10' : 'hover:bg-secondary/30'}`}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-sm font-medium text-foreground truncate">{template.name}</span>
                                                    {SYSTEM_TEMPLATES.includes(template.key) && (
                                                        <Badge variant="outline" className="text-[9px] shrink-0">System</Badge>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground truncate mt-0.5">{template.key}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Editor + Preview + Logs */}
                    <div className="xl:col-span-3 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-secondary/10 border border-border w-full justify-start h-auto p-1 text-foreground">
                                <TabsTrigger value="editor" className="gap-2"><Mail size={14} /> Editor</TabsTrigger>
                                <TabsTrigger value="preview" className="gap-2"><Eye size={14} /> Preview</TabsTrigger>
                                <TabsTrigger value="logs" className="gap-2"><Layout size={14} /> Logs</TabsTrigger>
                            </TabsList>

                            <TabsContent value="editor" className="mt-4 space-y-6">
                                {selectedTemplate ? (
                                    <Card className="bg-secondary/5 border-border">
                                        <CardHeader className="border-b border-border bg-secondary/10">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-foreground">{selectedTemplate.name}</CardTitle>
                                                    <CardDescription className="text-xs">Key: {selectedTemplate.key}</CardDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="template-active"
                                                        checked={form.is_active}
                                                        onCheckedChange={(checked: boolean) => setForm(prev => ({ ...prev, is_active: checked }))}
                                                        className="border-border"
                                                    />
                                                    <Label htmlFor="template-active" className="text-xs text-muted-foreground">Active</Label>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-5">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Template Name</Label>
                                                <Input
                                                    value={form.name}
                                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="bg-background border-border text-foreground"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-muted-foreground">Subject Line</Label>
                                                    <div className="flex flex-wrap gap-1 max-w-md justify-end">
                                                        {VARIABLES.filter(v => ['Person', 'Event', 'Consultation'].includes(v.group)).slice(0, 5).map(v => (
                                                            <button
                                                                key={v.label + 'subject'}
                                                                onClick={() => insertVariable(v.value, 'subject')}
                                                                className="text-[9px] bg-secondary hover:bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded border border-border"
                                                            >
                                                                {v.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Input
                                                    id="subject-input"
                                                    value={form.subject}
                                                    onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                                                    className="bg-background border-border text-foreground"
                                                    placeholder="Email subject line..."
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-muted-foreground">Body</Label>
                                                    <Tabs value={editorMode} onValueChange={(val: any) => setEditorMode(val)}>
                                                        <TabsList className="h-7 p-0.5">
                                                            <TabsTrigger value="visual" className="text-[10px] gap-1 px-2"><Sparkles size={10} /> Visual</TabsTrigger>
                                                            <TabsTrigger value="code" className="text-[10px] gap-1 px-2"><Code size={10} /> Code</TabsTrigger>
                                                        </TabsList>
                                                    </Tabs>
                                                </div>

                                                <div className="bg-secondary/10 border border-border/50 rounded-lg p-3 space-y-3">
                                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Insert Variable</div>
                                                    <div className="space-y-3">
                                                        {variablesByGroup.map(({ group, variables }) => (
                                                            <div key={group} className="space-y-1">
                                                                <div className="text-[10px] font-bold text-muted-foreground">{group}</div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {variables.map(v => (
                                                                        <button
                                                                            key={v.label}
                                                                            onClick={() => insertVariable(v.value, 'body')}
                                                                            className="text-[9px] bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20 transition-all font-bold"
                                                                            title={v.value}
                                                                        >
                                                                            + {v.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {editorMode === 'code' ? (
                                                    <Textarea
                                                        ref={bodyTextareaRef}
                                                        value={form.body}
                                                        onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
                                                        className="min-h-[400px] bg-[#010409] text-emerald-400 font-mono text-sm border-border"
                                                        placeholder="Enter Blade-compatible HTML here..."
                                                    />
                                                ) : (
                                                    <div className="min-h-[400px] bg-background border border-border rounded-lg overflow-hidden">
                                                        <RichTextEditor
                                                            value={form.body}
                                                            onChange={(value) => setForm(prev => ({ ...prev, body: value }))}
                                                            className="min-h-[400px]"
                                                        />
                                                    </div>
                                                )}

                                                <p className="text-xs text-muted-foreground">
                                                    Tip: Use <strong>Code</strong> mode for precise control over Blade variables and HTML. Use <strong>Visual</strong> mode for formatting text and links.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handlePreview()}
                                                    disabled={isPreviewLoading}
                                                    className="gap-2"
                                                >
                                                    {isPreviewLoading ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                                                    Preview
                                                </Button>
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="gap-2 bg-primary hover:bg-primary/90 text-white"
                                                >
                                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                    Save Template
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="text-center py-20 text-muted-foreground">
                                        Select a template from the sidebar to begin editing.
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="preview" className="mt-4 space-y-6">
                                <Card className="bg-secondary/5 border-border">
                                    <CardHeader className="border-b border-border bg-secondary/10 flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-foreground text-sm">Live Preview</CardTitle>
                                            <CardDescription className="text-xs">{previewSubject || 'No preview generated'}</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePreview()} disabled={isPreviewLoading} className="gap-2">
                                            {isPreviewLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                            Refresh
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {previewError && (
                                            <div className="p-4 bg-red-500/10 text-red-600 text-sm flex items-start gap-3 border-b border-red-200">
                                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="font-semibold">Preview could not be rendered</p>
                                                    <p className="font-mono text-xs break-all">{previewError}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-slate-100 min-h-[600px] relative">
                                            {isPreviewLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                                                    <Loader2 size={32} className="animate-spin text-primary" />
                                                </div>
                                            )}
                                            {previewHtml ? (
                                                <iframe
                                                    srcDoc={previewHtml}
                                                    className="w-full h-[600px] border-none"
                                                    title="Email Preview"
                                                />
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                                                    <Mail size={48} className="opacity-20 mb-4" />
                                                    <p>Click Preview to render the email.</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-secondary/5 border-border">
                                    <CardHeader className="border-b border-border bg-secondary/10">
                                        <CardTitle className="text-sm text-foreground">Send Test</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="flex gap-3">
                                            <Input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={testEmail}
                                                onChange={(e) => setTestEmail(e.target.value)}
                                                className="bg-background border-border text-foreground"
                                            />
                                            <Button
                                                onClick={handleSendTest}
                                                disabled={isSendingTest || !testEmail}
                                                className="gap-2 bg-primary hover:bg-primary/90 text-white"
                                            >
                                                {isSendingTest ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                                Send Test
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="logs" className="mt-4">
                                <Card className="bg-secondary/5 border-border">
                                    <CardHeader className="border-b border-border bg-secondary/10 flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-sm text-foreground">Recent Email Sends</CardTitle>
                                            <CardDescription className="text-xs">Last 50 logged emails</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => mutateLogs()} className="gap-2">
                                            <RefreshCw size={14} /> Refresh
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                                                    <tr>
                                                        <th className="px-4 py-3">Template</th>
                                                        <th className="px-4 py-3">Recipient</th>
                                                        <th className="px-4 py-3">Status</th>
                                                        <th className="px-4 py-3">Sent At</th>
                                                        <th className="px-4 py-3">Error</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/30">
                                                    {logs?.data?.map((log) => (
                                                        <tr key={log.id}>
                                                            <td className="px-4 py-3 font-medium">{log.template_key}</td>
                                                            <td className="px-4 py-3 text-muted-foreground">{log.recipient}</td>
                                                            <td className="px-4 py-3">
                                                                <Badge
                                                                    variant={log.status === 'sent' ? 'default' : 'destructive'}
                                                                    className="text-[9px]"
                                                                >
                                                                    {log.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                                {log.sent_at ? new Date(log.sent_at).toLocaleString() : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-red-500 text-xs max-w-xs truncate" title={log.error || undefined}>
                                                                {log.error || '—'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {!logs?.data?.length && (
                                                        <tr>
                                                            <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                                                No email logs found.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default EmailSettingsPage
