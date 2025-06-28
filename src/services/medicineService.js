import { supabase } from '../config/supabase'

export const medicineService = {
    // Mengambil semua data obat
    async getAllMedicines() {
        const { data, error } = await supabase
            .from('medicines')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Mengambil obat berdasarkan ID
    async getMedicineById(id) {
        const { data, error } = await supabase
            .from('medicines')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Menambah obat baru
    async createMedicine(medicineData) {
        const { data, error } = await supabase
            .from('medicines')
            .insert([medicineData])
            .select()

        if (error) throw error
        return data
    },

    // Mengupdate data obat
    async updateMedicine(id, medicineData) {
        const { data, error } = await supabase
            .from('medicines')
            .update(medicineData)
            .eq('id', id)
            .select()

        if (error) throw error
        return data
    },

    // Menghapus obat
    async deleteMedicine(id) {
        const { error } = await supabase
            .from('medicines')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Mencari obat berdasarkan nama
    async searchMedicines(searchTerm) {
        const { data, error } = await supabase
            .from('medicines')
            .select('*')
            .ilike('nama', `%${searchTerm}%`)

        if (error) throw error
        return data
    },

    // Mengambil statistik obat
    async getMedicineStats() {
        const { data, error } = await supabase
            .from('medicines')
            .select('*')

        if (error) throw error

        return {
            totalMedicines: data.length,
            lowStock: data.filter(med => med.stock < 10).length,
            outOfStock: data.filter(med => med.stock === 0).length,
            totalValue: data.reduce((sum, med) => sum + (med.harga * med.stock), 0)
        }
    }
}