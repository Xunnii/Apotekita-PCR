import { supabase } from '../config/supabase'

export const consultationService = {
    async submitConsultation(consultationData) {
        const { data, error } = await supabase
            .from('konsultasi_dokter')
            .insert([consultationData])
            .select()

        if (error) {
            console.error('Error submitting consultation:', error)
            throw error
        }
        return data
    },

    // Fungsi untuk admin (akan digunakan di langkah selanjutnya)
    async getAllConsultations() {
        const { data, error } = await supabase
            .from('konsultasi_dokter')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    async updateConsultationStatus(id, newStatus) {
        const { data, error } = await supabase
            .from('konsultasi_dokter')
            .update({ status: newStatus })
            .eq('id', id)
            .select()

        if (error) throw error
        return data
    }
} 