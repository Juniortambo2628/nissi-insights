"use client"

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Loader2, ShieldCheck, FileText, Cookie, Check } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import api from '@/lib/api'
import RichTextEditor from '@/components/admin/RichTextEditor'

const LegalSettingsPage = () => {
    const { data: settingsByGroup, mutate, isLoading } = useApi('/settings')
    const [formValues, setFormValues] = useState<Record<string, string>>({
        'privacy_policy': '',
        'terms_of_service': '',
        'cookie_policy': ''
    })
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState('privacy')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (settingsByGroup) {
            const flat: Record<string, string> = {}
            Object.values(settingsByGroup).forEach((group: any) => {
                group.forEach((s: any) => { flat[s.key] = s.value || '' })
            })
            setFormValues(prev => ({
                ...prev,
                ...flat
            }))
        }
    }, [settingsByGroup])

    const handleSave = async () => {
        setIsSaving(true)
        setSaveSuccess(false)
        try {
            const settings = [
                { key: 'privacy_policy', value: formValues['privacy_policy'], group: 'legal', type: 'rich-text' },
                { key: 'terms_of_service', value: formValues['terms_of_service'], group: 'legal', type: 'rich-text' },
                { key: 'cookie_policy', value: formValues['cookie_policy'], group: 'legal', type: 'rich-text' },
            ]

            await api.put('/settings/batch', { settings })
            mutate()
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch {
            alert('Failed to save legal settings')
        } finally {
            setIsSaving(false)
        }
    }

    const tabs = [
        { id: 'privacy', title: 'Privacy Policy', key: 'privacy_policy', icon: ShieldCheck },
        { id: 'terms', title: 'Terms of Service', key: 'terms_of_service', icon: FileText },
        { id: 'cookies', title: 'Cookie Policy', key: 'cookie_policy', icon: Cookie },
    ]

    const activeTabData = tabs.find(t => t.id === activeTab)

    return (
        <AdminLayout>
            <div className="space-y-8 pb-24">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Legal Content Management</h1>
                    <p className="text-muted-foreground">Manage your website's legal documents with a rich text editor.</p>
                </div>

                {!mounted || isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-[500px] bg-secondary/10 rounded-xl border border-border/50" />
                    </div>
                ) : activeTabData && (
                    <Card className="bg-secondary/10 border-border/50">
                        <CardHeader className="border-b border-border/50 bg-secondary/5">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <activeTabData.icon size={20} className="text-primary" />
                                {activeTabData.title}
                            </CardTitle>
                            <CardDescription>
                                This content will be displayed on the public /{(activeTabData.id === 'cookies' ? 'cookies' : activeTabData.id === 'terms' ? 'terms' : 'privacy')} page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <RichTextEditor 
                                value={formValues[activeTabData.key]} 
                                onChange={(val) => setFormValues(prev => ({ ...prev, [activeTabData.key]: val }))}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Document Context Switcher Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                <div className="bg-background/80 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {activeTabData && <activeTabData.icon size={18} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Document</p>
                            <Select
                                value={activeTab}
                                onValueChange={setActiveTab}
                            >
                                <SelectTrigger className="border-none bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm font-bold text-foreground">
                                    <SelectValue placeholder="Select Document" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    {tabs.map((tab) => (
                                        <SelectItem key={tab.id} value={tab.id}>
                                            <div className="flex items-center gap-2">
                                                <tab.icon size={14} />
                                                {tab.title}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-border/50" />
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block mr-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Document</p>
                            <p className="text-sm font-bold text-primary">{tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length}</p>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`gap-2 px-6 font-bold rounded-xl transition-all ${saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <Check size={16} /> : <Save size={16} />}
                            {saveSuccess ? 'Saved!' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default LegalSettingsPage
