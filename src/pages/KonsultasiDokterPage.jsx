import React from 'react';
import MainLayout from '../layout/MainLayout';
import { Link } from 'react-router-dom';

export default function KonsultasiDokter() {
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

                    {/* Form */}
                    <form className="space-y-6">
                        <div>
                            <label className="block text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap Anda"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="contoh@email.com"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Keluhan / Gejala</label>
                            <textarea
                                rows="4"
                                placeholder="Tuliskan keluhan Anda"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>


                        <Link to="/error-401">
                            <button
                                type="button"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                            >
                                Kirim Konsultasi
                            </button>
                        </Link>

                    </form>
                </div>
            </section>
        </div>
    );
}
