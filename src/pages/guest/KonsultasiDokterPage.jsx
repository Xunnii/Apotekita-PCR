import React, { useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import { Link } from 'react-router-dom'
import { consultationService } from '../../services/consultationService'
import AlertBox from '../../components/Note/AlertBox'

export default function KonsultasiDokter() {
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        keluhan: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            await consultationService.submitConsultation(formData)
            setSuccess('Konsultasi Anda berhasil dikirim! Kami akan segera menghubungi Anda.')
            setFormData({ nama_lengkap: '', email: '', keluhan: '' }) // Reset form
            setTimeout(() => setSuccess(null), 5000) // Hapus pesan sukses setelah 5 detik
        } catch (err) {
            setError('Gagal mengirim konsultasi. Silakan coba lagi nanti.')
            console.error('Error submitting consultation:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <section className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                        Konsultasi Dokter
                    </h2>

                    {/* Gambar */}
                    <div className="flex justify-center items-center mb-8">
                        <img
                            src="img\Konsultasi1.jpg"
                            alt="Konsultasi Dokter"
                            className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Deskripsi */}
                    <p className="text-gray-700 text-center mb-8">
                        Dapatkan layanan konsultasi langsung dengan dokter profesional kami. Silakan isi formulir berikut untuk membuat janji atau bertanya tentang gejala yang Anda alami.
                    </p>

                    {/* Alert */}
                    {error && <AlertBox type="error">{error}</AlertBox>}
                    {success && <AlertBox type="success">{success}</AlertBox>}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="nama_lengkap" className="block text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                id="nama_lengkap"
                                name="nama_lengkap"
                                value={formData.nama_lengkap}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap Anda"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contoh@email.com"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="keluhan" className="block text-gray-700 mb-1">Keluhan / Gejala</label>
                            <textarea
                                id="keluhan"
                                name="keluhan"
                                value={formData.keluhan}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tuliskan keluhan Anda"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Mengirim...' : 'Kirim Konsultasi'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
