import { useApi } from './use-api'
import { SiteSetting } from '@/types/api'

export function useSettings() {
    const { data: settingsByGroup, isLoading, isError } = useApi<Record<string, SiteSetting[]>>('/settings')

    const getSetting = (key: string) => {
        if (!settingsByGroup) return null
        for (const group of Object.values(settingsByGroup)) {
            const setting = group.find(s => s.key === key)
            if (setting) return setting.value
        }
        return null
    }

    const isEnabled = (key: string) => {
        const val = getSetting(key)
        return val === '1' || val === 'true'
    }

    return { getSetting, isEnabled, isLoading, isError }
}
