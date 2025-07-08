import { supabase } from '../config/supabase';

export async function insertPelanggan({ id, email, nama, alamat, phone }) {
    return await supabase
        .from('pelanggan')
        .insert([{ id, email, nama, alamat, phone, segmentasi: 'silver', total_pembelian: 0 }]);
}

export async function getPelangganById(id) {
    const { data, error } = await supabase
        .from('pelanggan')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
}

export async function updatePelangganProfile(id, { nama, alamat, phone, foto_profil }) {
    return await supabase
        .from('pelanggan')
        .update({ nama, alamat, phone, foto_profil })
        .eq('id', id);
}

export async function uploadProfilePhoto(userId, file) {
    // Store in 'profile-photo' bucket, filename: userId + extension
    const ext = file.name.split('.').pop();
    const filePath = `${userId}.${ext}`;
    const { data, error } = await supabase.storage
        .from('profile-photo')
        .upload(filePath, file, { upsert: true });
    if (error) return { error };
    // Get public URL
    const { data: publicUrlData } = supabase.storage
        .from('profile-photo')
        .getPublicUrl(filePath);
    return { url: publicUrlData.publicUrl };
}

// TESTIMONI SERVICES
export async function insertTestimoni({ pelanggan_id, quote, rating }) {
    return await supabase
        .from('testimoni')
        .insert([{ pelanggan_id, quote, rating }]);
}

export async function getTestimoni() {
    return await supabase
        .from('testimoni')
        .select('*');
}

// Get only approved testimonials, join pelanggan for name & photo
export async function getApprovedTestimoni() {
    return await supabase
        .from('testimoni')
        .select('id, quote, rating, created_at, pelanggan:pelanggan_id(nama, foto_profil)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
} 