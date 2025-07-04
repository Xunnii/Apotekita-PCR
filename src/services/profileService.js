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