import { supabase } from '../config/supabase'

export const salesReportService = {
    // Mengambil laporan penjualan dengan aggregation
    async getSalesReport(filters = {}) {
        try {
            let query = supabase
                .from('riwayat_pembelian')
                .select(`
                    *,
                    pelanggan:pelanggan_id(nama, email)
                `)
                .order('tanggal_transaksi', { ascending: false })

            // Apply filters
            if (filters.startDate) {
                query = query.gte('tanggal_transaksi', filters.startDate)
            }
            if (filters.endDate) {
                query = query.lte('tanggal_transaksi', filters.endDate)
            }
            if (filters.status) {
                query = query.eq('status_order', filters.status)
            }
            if (filters.produk_tipe) {
                query = query.eq('produk_tipe', filters.produk_tipe)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching sales report:', error)
                // Fallback to simple query if join fails
                return await this.getSalesReportSimple(filters)
            }

            // Transform data untuk laporan
            const transformedData = data.map(item => ({
                id: item.id,
                produk: item.nama_produk,
                tipe_produk: item.produk_tipe,
                total_produk: item.jumlah,
                total_pembelian: item.total_pembelian,
                tanggal_transaksi: item.tanggal_transaksi,
                status: item.status_order,
                pelanggan: item.pelanggan?.nama || `Pelanggan ${item.pelanggan_id?.slice(0, 8)}` || 'Unknown',
                pelanggan_email: item.pelanggan?.email || '',
                pelanggan_id: item.pelanggan_id,
                alamat: item.alamat_tujuan,
                metode_pembayaran: item.metode_pembayaran
            }))

            return transformedData
        } catch (error) {
            console.error('Error in getSalesReport:', error)
            // Fallback to simple query
            return await this.getSalesReportSimple(filters)
        }
    },

    // Fallback method jika join gagal
    async getSalesReportSimple(filters = {}) {
        try {
            let query = supabase
                .from('riwayat_pembelian')
                .select('*')
                .order('tanggal_transaksi', { ascending: false })

            // Apply filters
            if (filters.startDate) {
                query = query.gte('tanggal_transaksi', filters.startDate)
            }
            if (filters.endDate) {
                query = query.lte('tanggal_transaksi', filters.endDate)
            }
            if (filters.status) {
                query = query.eq('status_order', filters.status)
            }
            if (filters.produk_tipe) {
                query = query.eq('produk_tipe', filters.produk_tipe)
            }

            const { data, error } = await query

            if (error) throw error

            // Transform data untuk laporan
            const transformedData = data.map(item => ({
                id: item.id,
                produk: item.nama_produk,
                tipe_produk: item.produk_tipe,
                total_produk: item.jumlah,
                total_pembelian: item.total_pembelian,
                tanggal_transaksi: item.tanggal_transaksi,
                status: item.status_order,
                pelanggan: `Pelanggan ${item.pelanggan_id?.slice(0, 8)}` || 'Unknown',
                pelanggan_email: '',
                pelanggan_id: item.pelanggan_id,
                alamat: item.alamat_tujuan,
                metode_pembayaran: item.metode_pembayaran
            }))

            return transformedData
        } catch (error) {
            console.error('Error in getSalesReportSimple:', error)
            return []
        }
    },

    // Mengambil statistik penjualan
    async getSalesStats(filters = {}) {
        try {
            let query = supabase
                .from('riwayat_pembelian')
                .select('total_pembelian, jumlah, produk_tipe, tanggal_transaksi')

            // Apply filters
            if (filters.startDate) {
                query = query.gte('tanggal_transaksi', filters.startDate)
            }
            if (filters.endDate) {
                query = query.lte('tanggal_transaksi', filters.endDate)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching sales stats:', error)
                // Return default values if table doesn't exist
                return {
                    totalRevenue: 0,
                    totalItems: 0,
                    totalTransactions: 0,
                    productTypeStats: {},
                    averageOrderValue: 0
                }
            }

            // Calculate statistics
            const totalRevenue = data.reduce((sum, item) => sum + (item.total_pembelian || 0), 0)
            const totalItems = data.reduce((sum, item) => sum + (item.jumlah || 0), 0)
            const totalTransactions = data.length

            // Group by product type
            const productTypeStats = data.reduce((acc, item) => {
                const type = item.produk_tipe || 'unknown'
                if (!acc[type]) {
                    acc[type] = { revenue: 0, items: 0, transactions: 0 }
                }
                acc[type].revenue += item.total_pembelian || 0
                acc[type].items += item.jumlah || 0
                acc[type].transactions += 1
                return acc
            }, {})

            return {
                totalRevenue,
                totalItems,
                totalTransactions,
                productTypeStats,
                averageOrderValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
            }
        } catch (error) {
            console.error('Error in getSalesStats:', error)
            // Return default values if error
            return {
                totalRevenue: 0,
                totalItems: 0,
                totalTransactions: 0,
                productTypeStats: {},
                averageOrderValue: 0
            }
        }
    },

    // Mengambil top selling products
    async getTopSellingProducts(limit = 10, filters = {}) {
        try {
            let query = supabase
                .from('riwayat_pembelian')
                .select('nama_produk, jumlah, total_pembelian, produk_tipe')

            // Apply filters
            if (filters.startDate) {
                query = query.gte('tanggal_transaksi', filters.startDate)
            }
            if (filters.endDate) {
                query = query.lte('tanggal_transaksi', filters.endDate)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching top products:', error)
                return []
            }

            // Group by product name
            const productStats = data.reduce((acc, item) => {
                const productName = item.nama_produk
                if (!acc[productName]) {
                    acc[productName] = {
                        nama: productName,
                        tipe: item.produk_tipe,
                        total_terjual: 0,
                        total_revenue: 0
                    }
                }
                acc[productName].total_terjual += item.jumlah || 0
                acc[productName].total_revenue += item.total_pembelian || 0
                return acc
            }, {})

            // Convert to array and sort by total sold
            const topProducts = Object.values(productStats)
                .sort((a, b) => b.total_terjual - a.total_terjual)
                .slice(0, limit)

            return topProducts
        } catch (error) {
            console.error('Error in getTopSellingProducts:', error)
            return []
        }
    },

    // Mengambil laporan penjualan harian
    async getDailySalesReport(startDate, endDate) {
        try {
            const { data, error } = await supabase
                .from('riwayat_pembelian')
                .select('total_pembelian, jumlah, tanggal_transaksi')
                .gte('tanggal_transaksi', startDate)
                .lte('tanggal_transaksi', endDate)
                .order('tanggal_transaksi', { ascending: true })

            if (error) throw error

            // Group by date
            const dailyStats = data.reduce((acc, item) => {
                const date = item.tanggal_transaksi
                if (!acc[date]) {
                    acc[date] = { date, revenue: 0, items: 0, transactions: 0 }
                }
                acc[date].revenue += item.total_pembelian || 0
                acc[date].items += item.jumlah || 0
                acc[date].transactions += 1
                return acc
            }, {})

            return Object.values(dailyStats)
        } catch (error) {
            throw error
        }
    }
} 