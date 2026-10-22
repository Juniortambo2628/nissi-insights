"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/admin/StatusBadge'
import CampaignSendDialog from '@/components/admin/CampaignSendDialog'
import api from '@/lib/api'
import { Campaign, Newsletter } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, Send, Trash2, Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react'

const statusVariant = (status: Campaign['status']) => {
    switch (status) {
        case 'sent': return 'success' as const
        case 'failed': return 'danger' as const
        case 'sending': return 'warning' as const
        default: return 'muted' as const
    }
}

const AdminCampaignsPage = () => {
    const { data: campaigns, mutate, isLoading } = useApi<Campaign[]>('/campaigns')
    const { data: newsletters, mutate: mutateNewsletters } = useApi<Newsletter[]>('/newsletters')
    const { toast } = useToast()

    const [showSend, setShowSend] = useState(false)
    const [sendCampaign, setSendCampaign] = useState<Campaign | null>(null)

    const handleSendClick = (campaign: Campaign) => {
        setSendCampaign(campaign)
        setShowSend(true)
    }

    const handleNewCampaign = () => {
        setSendCampaign(null)
        setShowSend(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return
        try {
            await api.delete(`/campaigns/${id}`)
            toast({ title: 'Deleted', description: 'Campaign has been removed.' })
            mutate()
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete campaign' })
        }
    }

    const totalSent = campaigns?.reduce((sum, c) => sum + c.sent_count, 0) || 0
    const totalFailed = campaigns?.reduce((sum, c) => sum + c.failed_count, 0) || 0

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Email Campaigns</h1>
                        <p className="text-muted-foreground">Share newsletters with your saved contacts.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 text-sm">
                            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                <CheckCircle2 size={14} /> {totalSent} sent
                            </span>
                            {totalFailed > 0 && (
                                <span className="flex items-center gap-1.5 text-red-500 font-bold">
                                    <XCircle size={14} /> {totalFailed} failed
                                </span>
                            )}
                        </div>
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white" onClick={handleNewCampaign}>
                            <Plus size={18} />
                            New Campaign
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-secondary/20 animate-pulse border border-border/50" />)}
                    </div>
                ) : campaigns && campaigns.length > 0 ? (
                    <div className="bg-secondary/10 border border-border/50 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/20 border-b border-border/50">
                                <tr>
                                    <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Campaign</th>
                                    <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Newsletter</th>
                                    <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                                    <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Delivery</th>
                                    <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                                    <th className="p-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">{campaign.name}</div>
                                            {campaign.subject && (
                                                <div className="text-xs text-muted-foreground">Subject: {campaign.subject}</div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                <Mail size={12} /> {campaign.newsletter?.title || '—'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge variant={statusVariant(campaign.status)}>
                                                {campaign.status === 'sending' && <Loader2 size={10} className="animate-spin" />}
                                                {campaign.status}
                                            </StatusBadge>
                                        </td>
                                        <td className="p-4 text-xs text-muted-foreground">
                                            {campaign.sent_count}/{campaign.total_recipients} sent
                                            {campaign.failed_count > 0 && (
                                                <span className="text-red-500 ml-1">· {campaign.failed_count} failed</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-muted-foreground">
                                            {campaign.sent_at
                                                ? new Date(campaign.sent_at).toLocaleDateString()
                                                : new Date(campaign.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {campaign.status === 'draft' && (
                                                    <Button size="sm" className="gap-1.5" onClick={() => handleSendClick(campaign)}>
                                                        <Send size={14} /> Send
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(campaign.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-xl">
                        <Mail size={40} className="mx-auto mb-4 text-muted-foreground/40" />
                        <p className="text-muted-foreground mb-4">No campaigns yet. Share a newsletter with your contacts.</p>
                        <Button onClick={handleNewCampaign} className="gap-2">
                            <Plus size={16} /> New Campaign
                        </Button>
                    </div>
                )}
            </div>

            <CampaignSendDialog
                open={showSend}
                onOpenChange={(open) => { setShowSend(open); if (!open) setSendCampaign(null) }}
                newsletters={newsletters || []}
                existingCampaign={sendCampaign}
                onSent={() => { mutate(); mutateNewsletters() }}
            />
        </AdminLayout>
    )
}

export default AdminCampaignsPage
