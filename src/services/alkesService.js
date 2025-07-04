import { supabase } from '../config/supabase';

export const alkesService = {
    // Ambil semua data alkes
    async getAllAlkes() {
        const { data, error } = await supabase
            .from('alat_kesehatan')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    // Tambah alkes baru
    async createAlkes(alkesData) {
        const { data, error } = await supabase
            .from('alat_kesehatan')
            .insert([alkesData])
            .select();
        if (error) throw error;
        return data;
    },

    // Update alkes
    async updateAlkes(id, alkesData) {
        const { data, error } = await supabase
            .from('alat_kesehatan')
            .update(alkesData)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    },

    // Hapus alkes
    async deleteAlkes(id) {
        const { error } = await supabase
            .from('alat_kesehatan')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Upload gambar ke Storage (ganti 'alkes-image' jika nama bucket berbeda)
    async uploadGambar(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `alkes/${fileName}`;
        const { data, error } = await supabase.storage.from('alkes-image').upload(filePath, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('alkes-image').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    }
}; 