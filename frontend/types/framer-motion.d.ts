/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'framer-motion' {
  export const motion: Record<string, any>
  export const AnimatePresence: any
  export function useScroll(options?: any): any
  export function useTransform(value: any, input: any[], output: any[]): any
  export function useInView(ref: any, options?: any): boolean
  export const Reorder: {
    Group: any
    Item: any
  }
}
