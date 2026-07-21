import { renderHook } from '@testing-library/react'
import { useApi } from '@/hooks/use-api'

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import useSWR from 'swr'

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns data from SWR', () => {
    const mockData = [{ id: 1, title: 'Service 1' }]
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useApi('/services'))

    expect(result.current.data).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBeUndefined()
  })

  it('returns loading state', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useApi('/services'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('returns error state', () => {
    const mockError = new Error('Failed to fetch')
    ;(useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useApi('/services'))

    expect(result.current.isError).toBe(mockError)
    expect(result.current.data).toBeUndefined()
  })

  it('returns mutate function', () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
    })

    const { result } = renderHook(() => useApi('/services'))

    expect(typeof result.current.mutate).toBe('function')
  })

  it('passes options to SWR', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    })

    renderHook(() => useApi('/services', { revalidateOnFocus: true }))

    expect(useSWR).toHaveBeenCalledWith(
      '/services',
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: true })
    )
  })
})
