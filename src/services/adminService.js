import { supabase } from '../config/supabase'

// Fungsi untuk mendapatkan semua data obat
export const getAllMedicines = async () => {
    const { data, error } = await supabase
        .from('daftar_obat')
        .select('*')

    if (error) throw error
    return data
}

// Fungsi untuk menambahkan obat baru
export const addMedicine = async (medicineData) => {
    const { data, error } = await supabase
        .from('daftar_obat')
        .insert([medicineData])
        .select()

    if (error) throw error
    return data
}

// Fungsi untuk mengupdate data obat
export const updateMedicine = async (id, medicineData) => {
    const { data, error } = await supabase
        .from('daftar_obat')
        .update(medicineData)
        .eq('id', id)
        .select()

    if (error) throw error
    return data
}

// Fungsi untuk menghapus obat
export const deleteMedicine = async (id) => {
    const { error } = await supabase
        .from('daftar_obat')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Fungsi untuk mendapatkan statistik
export const getDashboardStats = async () => {
    const { data: medicines, error: medicinesError } = await supabase
        .from('daftar_obat')
        .select('*')

    if (medicinesError) throw medicinesError

    return {
        totalMedicines: medicines.length,
        // totalOrders: orders.length, // Hapus jika tidak ada tabel orders
        // Tambahkan statistik lain sesuai kebutuhan
    }
}