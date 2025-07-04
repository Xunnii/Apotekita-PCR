import { supabase } from '../config/supabase'

export const medicineService = {
    // Mengambil semua data obat
    async getAllMedicines() {
        const { data, error } = await supabase
            .from('daftar_obat')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Mengambil obat berdasarkan ID
    async getMedicineById(id) {
        const { data, error } = await supabase
            .from('daftar_obat')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Menambah obat baru
    async createMedicine(medicineData) {
        const { data, error } = await supabase
            .from('daftar_obat')
            .insert([medicineData])
            .select()

        if (error) throw error
        return data
    },

    // Mengupdate data obat
    async updateMedicine(id, medicineData) {
        const { data, error } = await supabase
            .from('daftar_obat')
            .update(medicineData)
            .eq('id', id)
            .select()

        if (error) throw error
        return data
    },

    // Menghapus obat
    async deleteMedicine(id) {
        const { error } = await supabase
            .from('daftar_obat')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Mencari obat berdasarkan nama
    async searchMedicines(searchTerm) {
        const { data, error } = await supabase
            .from('daftar_obat')
            .select('*')
            .ilike('nama_obat', `%${searchTerm}%`)

        if (error) throw error
        return data
    },

    // Mengambil statistik obat
    async getMedicineStats() {
        const { data, error } = await supabase
            .from('daftar_obat')
            .select('*')

        if (error) throw error

        return {
            totalMedicines: data.length,
            lowStock: data.filter(med => med.stok_obat < 10).length,
            outOfStock: data.filter(med => med.stok_obat === 0).length,
            totalValue: data.reduce((sum, med) => sum + (med.harga_obat * med.stok_obat), 0)
        }
    },

    // Fungsi upload gambar ke Supabase Storage
    async uploadGambar(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `obat/${fileName}`;
        const { data, error } = await supabase.storage.from('obat-image').upload(filePath, file);
        if (error) throw error;
        // Dapatkan public URL
        const { data: publicUrlData } = supabase.storage.from('obat-image').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    }
}