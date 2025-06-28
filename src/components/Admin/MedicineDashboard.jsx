import { useState, useEffect } from 'react'
import { medicineService } from '../../services/medicineService'

const MedicineDashboard = () => {
    const [medicines, setMedicines] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [medicinesData, statsData] = await Promise.all([
                medicineService.getAllMedicines(),
                medicineService.getMedicineStats()
            ])
            setMedicines(medicinesData)
            setStats(statsData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        const value = e.target.value
        setSearchTerm(value)

        if (value.trim()) {
            try {
                const results = await medicineService.searchMedicines(value)
                setMedicines(results)
            } catch (err) {
                setError(err.message)
            }
        } else {
            loadData()
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus obat ini?')) {
            try {
                await medicineService.deleteMedicine(id)
                setMedicines(medicines.filter(medicine => medicine.id !== id))
                // Perbarui statistik setelah penghapusan
                const statsData = await medicineService.getMedicineStats()
                setStats(statsData)
            } catch (err) {
                setError(err.message)
            }
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="container mx-auto p-4">
            {/* Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Obat</h3>
                    <p className="text-2xl font-bold">{stats?.totalMedicines}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Stok Menipis</h3>
                    <p className="text-2xl font-bold text-yellow-500">{stats?.lowStock}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Habis</h3>
                    <p className="text-2xl font-bold text-red-500">{stats?.outOfStock}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Nilai</h3>
                    <p className="text-2xl font-bold">Rp {stats?.totalValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Pencarian */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Cari obat..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {/* Daftar Obat */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicines.map((medicine) => (
                    <div key={medicine.id} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold">{medicine.nama}</h3>
                        <p className="text-gray-600">Stok: {medicine.stock}</p>
                        <p className="text-gray-600">Harga: Rp {medicine.harga.toLocaleString()}</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => handleDelete(medicine.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Hapus
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MedicineDashboard