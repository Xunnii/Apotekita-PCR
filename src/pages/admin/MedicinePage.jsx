import React, { useState, useEffect } from "react"
import { medicineService } from '../../services/medicineService'
import AlertBox from '../../components/Note/AlertBox'
import GenericTable from '../../components/Note/GenericTable'
import EmptyState from '../../components/Note/EmptyState'
import LoadingSpinner from '../../components/Note/LoadingSpinner'
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai"

export default function MedicinePage() {
    const [dataForm, setDataForm] = useState({
        nama: "", stock: "", harga: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [medicines, setMedicines] = useState([])
    const [editingMedicineId, setEditingMedicineId] = useState(null) // Untuk melacak ID obat yang sedang diedit

    // Handle perubahan nilai input form
    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({
            ...dataForm,
            [name]: value,
        })
    }

    // Memuat data obat
    const loadMedicines = async () => {
        try {
            setLoading(true)
            setError("")
            const data = await medicineService.getAllMedicines()
            setMedicines(data)
        } catch (err) {
            setError("Gagal memuat data obat")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Load data saat pertama di-render
    useEffect(() => {
        loadMedicines()
    }, [])

    // Handle form submission untuk membuat atau mengupdate obat
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError("")
            setSuccess("")

            const payload = {
                nama: dataForm.nama,
                stock: parseInt(dataForm.stock), // Pastikan stock adalah integer
                harga: parseFloat(dataForm.harga), // Pastikan harga adalah float/numeric
            }

            if (editingMedicineId) {
                // Update obat
                await medicineService.updateMedicine(editingMedicineId, payload)
                setSuccess("Obat berhasil diperbarui!")
            } else {
                // Tambah obat baru
                await medicineService.createMedicine(payload)
                setSuccess("Obat berhasil ditambahkan!")
            }

            setDataForm({ nama: "", stock: "", harga: "" }) // Reset form
            setEditingMedicineId(null) // Hapus mode edit
            setTimeout(() => setSuccess(""), 3000) // Hapus pesan sukses setelah 3 detik
            loadMedicines() // Muat ulang data
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle delete obat
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus obat ini?")) return
        try {
            setLoading(true)
            setError("")
            await medicineService.deleteMedicine(id)
            setSuccess("Obat berhasil dihapus!")
            setTimeout(() => setSuccess(""), 3000)
            loadMedicines()
        } catch (err) {
            setError("Gagal menghapus obat")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle edit obat (mengisi form dengan data obat yang dipilih)
    const handleEdit = (medicine) => {
        setDataForm({
            nama: medicine.nama,
            stock: medicine.stock.toString(), // Konversi ke string untuk input type="text"
            harga: medicine.harga.toString(), // Konversi ke string untuk input type="text"
        })
        setEditingMedicineId(medicine.id)
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Manajemen Obat
                </h2>
            </div>
            {/* Alert */}
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingMedicineId ? "Edit Obat" : "Tambah Obat Baru"}
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nama"
                            value={dataForm.nama}
                            placeholder="Nama Obat"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all
                                duration-200"
                            disabled={loading}
                        />
                        <input
                            type="number"
                            name="stock"
                            value={dataForm.stock}
                            placeholder="Stok"
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all
                                duration-200"
                            disabled={loading}
                        />
                        <input
                            type="number"
                            name="harga"
                            value={dataForm.harga}
                            placeholder="Harga"
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01" // Untuk harga desimal
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all
                                duration-200"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-pudar2)] text-white font-semibold
                                rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
                                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Mohon Tunggu..." : (editingMedicineId ? "Perbarui Obat" : "Tambah Obat")}
                        </button>
                        {editingMedicineId && (
                            <button
                                type="button"
                                onClick={() => { setEditingMedicineId(null); setDataForm({ nama: "", stock: "", harga: "" }); }}
                                className="ml-4 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold
                                    rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300
                                    focus:ring-offset-2 transition-all duration-200 shadow-lg"
                                disabled={loading}
                            >
                                Batal Edit
                            </button>
                        )}
                    </form>
                </div>
                {/* Medicine Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
                    <div className="px-6 py-4 ">
                        <h3 className="text-lg font-semibold">
                            Daftar Obat ({medicines.length})
                        </h3>
                    </div>
                    {loading && <LoadingSpinner text="Memuat data obat..." />}
                    {!loading && medicines.length === 0 && <EmptyState text="Belum ada data obat" />}
                    {!loading && medicines.length > 0 && (
                        <GenericTable
                            columns={["#", "Nama Obat", "Stok", "Harga", "Aksi"]}
                            data={medicines}
                            renderRow={(medicine, index) => (
                                <>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {index + 1}.
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--color-primary)]">
                                            {medicine.nama}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            {medicine.stock}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            Rp {medicine.harga.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => handleEdit(medicine)}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                <AiOutlineEdit className="text-blue-400 text-2xl hover:text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(medicine.id)}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                            >
                                                <AiFillDelete className="text-red-400 text-2xl hover:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    )
} 