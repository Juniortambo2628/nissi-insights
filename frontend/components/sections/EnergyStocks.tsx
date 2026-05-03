"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react'
import api from '@/lib/api'

interface Stock {
    symbol: string
    price: number
    change: number
    changePercent: number
}

const EnergyStocks = () => {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await api.get('/stocks')
                setStocks(response.data)
            } catch (error) {
                console.error("Failed to fetch stocks", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStocks()
        const interval = setInterval(fetchStocks, 60000) // Refresh every minute
        return () => clearInterval(interval)
    }, [])

    if (isLoading && stocks.length === 0) {
        return (
            <div className="w-full bg-[#050a1a] py-4 border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-8 overflow-hidden">
                    <Activity className="text-primary animate-pulse h-5 w-5" />
                    <div className="flex gap-12 animate-pulse">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-4 w-32 bg-white/10 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full bg-[#050a1a] py-3 border-y border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
            
            <div className="max-w-[1400px] mx-auto px-6 flex items-center relative z-10">
                <div className="flex items-center gap-2 mr-10 shrink-0">
                    <div className="p-1.5 bg-primary/20 rounded-md">
                        <Zap size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Live Energy Markets</span>
                </div>

                <div className="flex-1 overflow-hidden">
                    <motion.div 
                        animate={{ x: [0, -1000] }}
                        transition={{ 
                            duration: 40, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        className="flex items-center gap-16 whitespace-nowrap"
                    >
                        {[...stocks, ...stocks].map((stock, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-sm font-bold text-white">{stock.symbol}</span>
                                <span className="text-sm font-mono text-white/80">${stock.price.toFixed(2)}</span>
                                <div className={`flex items-center gap-1 text-xs font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(stock.changePercent).toFixed(2)}%
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="ml-10 shrink-0 hidden md:flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Market Open</span>
                </div>
            </div>
        </div>
    )
}

export default EnergyStocks
