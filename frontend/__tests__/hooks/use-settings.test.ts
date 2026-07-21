import { renderHook } from '@testing-library/react'
import { useSettings } from '@/hooks/use-settings'

jest.mock('@/hooks/use-api', () => ({
  useApi: jest.fn(),
}))

import { useApi } from '@/hooks/use-api'

describe('useSettings', () => {
  const mockUseApi = useApi as jest.MockedFunction<typeof useApi>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns settings data', () => {
    const mockSettings = [
      { key: 'site_name', value: 'Nissi Insights' },
      { key: 'site_tagline', value: 'Expert Advisory' },
    ]
    mockUseApi.mockReturnValue({
      data: mockSettings,
      isLoading: false,
      isError: undefined,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    expect(result.current.isLoading).toBe(false)
  })

  it('getSetting returns correct value', () => {
    const mockSettings = [
      { key: 'site_name', value: 'Nissi Insights' },
    ]
    mockUseApi.mockReturnValue({
      data: mockSettings,
      isLoading: false,
      isError: undefined,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    expect(result.current.getSetting('site_name', '')).toBe('Nissi Insights')
  })

  it('getSetting returns default when key not found', () => {
    mockUseApi.mockReturnValue({
      data: [],
      isLoading: false,
      isError: undefined,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    expect(result.current.getSetting('missing_key', 'default value')).toBe('default value')
  })

  it('returns loading state from useApi', () => {
    mockUseApi.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: undefined,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    expect(result.current.isLoading).toBe(true)
  })

  it('returns error state from useApi', () => {
    mockUseApi.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: new Error('Failed'),
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    expect(result.current.isError).toBeDefined()
  })
})
