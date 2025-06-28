import { useState, useEffect } from 'react'
import { getAllMedicines, deleteMedicine } from '../../services/adminService'

const MedicineList = () => {
    const [medicines, setMedicines] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchMedicines()
    }, [])

    const fetchMedicines = async () => {
        try {
            const data = await getAllMedicines()
            setMedicines(data)
            setLoading(false)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteMedicine(id)
            setMedicines(medicines.filter(medicine => medicine.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Daftar Obat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicines.map((medicine) => (
                    <div key={medicine.id} className="border p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold">{medicine.name}</h3>
                        <p className="text-gray-600">Stok: {medicine.stock}</p>
                        <p className="text-gray-600">Harga: Rp {medicine.price}</p>
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

export default MedicineList