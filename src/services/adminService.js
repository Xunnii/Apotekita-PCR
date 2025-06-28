import { supabase } from '../config/supabase'

// Fungsi untuk mendapatkan semua data obat
export const getAllMedicines = async () => {
    const { data, error } = await supabase
        .from('medicines')
        .select('*')

    if (error) throw error
    return data
}

// Fungsi untuk menambahkan obat baru
export const addMedicine = async (medicineData) => {
    const { data, error } = await supabase
        .from('medicines')
        .insert([medicineData])
        .select()

    if (error) throw error
    return data
}

// Fungsi untuk mengupdate data obat
export const updateMedicine = async (id, medicineData) => {
    const { data, error } = await supabase
        .from('medicines')
        .update(medicineData)
        .eq('id', id)
        .select()

    if (error) throw error
    return data
}

// Fungsi untuk menghapus obat
export const deleteMedicine = async (id) => {
    const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Fungsi untuk mendapatkan statistik
export const getDashboardStats = async () => {
    const { data: medicines, error: medicinesError } = await supabase
        .from('medicines')
        .select('*')

    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')

    if (medicinesError || ordersError) throw medicinesError || ordersError

    return {
        totalMedicines: medicines.length,
        totalOrders: orders.length,
        // Tambahkan statistik lain sesuai kebutuhan
    }
}