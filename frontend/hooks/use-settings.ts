"use client"

import { useApi } from "./use-api"

export function useSettings() {
    const { data: settingsByGroup, isLoading, isError } = useApi('/settings')

    const getSetting = (key: string, defaultValue: string = '') => {
        if (!settingsByGroup) return defaultValue
        
        // Settings can be grouped or a flat list depending on API response
        // Usually it's { groupName: [ {key, value}, ... ] }
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value ?? defaultValue
    }

    const isEnabled = (key: string, defaultValue: boolean = false) => {
        const val = getSetting(key)
        if (val === '') return defaultValue
        return val === '1' || val === 'true' || val === true
    }

    return {
        getSetting,
        isEnabled,
        settingsByGroup,
        isLoading,
        isError
    }
}
