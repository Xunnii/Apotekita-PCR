import { supabase } from '../config/supabase';

export async function getFAQs() {
    const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('id', { ascending: true });
    if (error) throw error;
    return data;
} 