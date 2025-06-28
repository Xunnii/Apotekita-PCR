import React, { useState, useEffect } from "react"
import { consultationService } from '../../services/consultationService'
import AlertBox from '../../components/Note/AlertBox'
import GenericTable from '../../components/Note/GenericTable'
import EmptyState from '../../components/Note/EmptyState'
import LoadingSpinner from '../../components/Note/LoadingSpinner'
import { AiOutlineEye, AiOutlineCheck, AiOutlineClose } from "react-icons/ai"

export default function ConsultationAdminPage() {
    const [consultations, setConsultations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Memuat data konsultasi
    const loadConsultations = async () => {
        try {
            setLoading(true)
            setError("")
            const data = await consultationService.getAllConsultations()
            setConsultations(data)
        } catch (err) {
            setError("Gagal memuat data konsultasi")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Load data saat pertama di-render
    useEffect(() => {
        loadConsultations()
    }, [])

    // Handle perubahan status konsultasi
    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Apakah Anda yakin ingin mengubah status ini menjadi ${newStatus}?`)) return
        try {
            setLoading(true)
            setError("")
            await consultationService.updateConsultationStatus(id, newStatus)
            setSuccess(`Status konsultasi berhasil diubah menjadi ${newStatus}!`);
            setTimeout(() => setSuccess(""), 3000);
            loadConsultations()
        } catch (err) {
            setError("Gagal mengubah status konsultasi")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading && consultations.length === 0) return <LoadingSpinner text="Memuat data konsultasi..." />
    if (error) return <AlertBox type="error">Error: {error}</AlertBox>

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Manajemen Konsultasi Dokter
                </h2>
            </div>
            {/* Alert */}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 ">
                    <h3 className="text-lg font-semibold">
                        Daftar Konsultasi ({consultations.length})
                    </h3>
                </div>

                {!loading && consultations.length === 0 && <EmptyState text="Belum ada data konsultasi" />}
                {!loading && consultations.length > 0 && (
                    <GenericTable
                        columns={["#", "Nama Lengkap", "Email", "Keluhan", "Status", "Aksi"]}
                        data={consultations}
                        renderRow={(consultation, index) => (
                            <>
                                <td className="px-6 py-4 font-medium text-gray-700">
                                    {index + 1}.
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-800">
                                        {consultation.nama_lengkap}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-600">
                                        {consultation.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="truncate text-gray-600">
                                        {consultation.keluhan}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            consultation.status === 'dilihat' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'}`}>
                                        {consultation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="flex gap-2 items-center">
                                        <button
                                            onClick={() => alert(`Keluhan: ${consultation.keluhan}`)} // Contoh melihat keluhan lengkap
                                            disabled={loading}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <AiOutlineEye className="text-gray-500 text-2xl hover:text-gray-700" />
                                        </button>
                                        {consultation.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatusChange(consultation.id, 'dilihat')}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                <AiOutlineCheck className="text-blue-500 text-2xl hover:text-blue-700" />
                                            </button>
                                        )}
                                        {consultation.status === 'dilihat' && (
                                            <button
                                                onClick={() => handleStatusChange(consultation.id, 'selesai')}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-green-100 transition-colors"
                                            >
                                                <AiOutlineCheck className="text-green-500 text-2xl hover:text-green-700" />
                                            </button>
                                        )}
                                        {consultation.status !== 'selesai' && (
                                            <button
                                                onClick={() => handleStatusChange(consultation.id, 'dibatalkan')}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                            >
                                                <AiOutlineClose className="text-red-500 text-2xl hover:text-red-700" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </>
                        )}
                    />
                )}
            </div>
        </div>
    )
} 