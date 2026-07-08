"use client"

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface Column<T> {
    key: string
    header: React.ReactNode
    cell: (row: T) => React.ReactNode
    className?: string
    hide?: 'sm' | 'md' | 'lg' | 'xl'
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    isLoading?: boolean
    keyExtractor: (row: T) => string | number
    emptyMessage?: string
    skeletonRows?: number
}

export function DataTable<T>({
    columns,
    data,
    isLoading = false,
    keyExtractor,
    emptyMessage = 'No items found.',
    skeletonRows = 5,
}: DataTableProps<T>) {
    const hideClass = (hide?: string) => {
        switch (hide) {
            case 'sm': return 'hidden sm:table-cell'
            case 'md': return 'hidden md:table-cell'
            case 'lg': return 'hidden lg:table-cell'
            case 'xl': return 'hidden xl:table-cell'
            default: return ''
        }
    }

    return (
        <div className="bg-secondary/10 border border-border/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                        <TableRow className="hover:bg-transparent">
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={`${hideClass(column.hide)} ${column.className || ''}`}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/30">
                        {isLoading ? (
                            Array.from({ length: skeletonRows }).map((_, i) => (
                                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            className={`${hideClass(column.hide)} py-4`}
                                        >
                                            <div className="h-4 bg-secondary/30 rounded animate-pulse w-3/4" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="px-6 py-20 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={keyExtractor(row)}
                                    className="hover:bg-secondary/5 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            className={`${hideClass(column.hide)} ${column.className || ''}`}
                                        >
                                            {column.cell(row)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
