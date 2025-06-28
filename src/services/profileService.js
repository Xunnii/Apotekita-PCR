import { supabase } from '../config/supabase';

export async function insertProfile({ id, email, phone, nama }) {
    return await supabase
        .from('profiles')
        .insert([{ id, email, phone, nama }]);
}

export async function getProfileById(id) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
} 