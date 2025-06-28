import { supabase } from '../config/supabase';

export async function insertProfile({ id, email, phone, nama }) {
    return await supabase
        .from('profiles')
        .insert([{ id, email, phone, nama }]);
} 