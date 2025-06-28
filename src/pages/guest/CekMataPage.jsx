import PageHeader from '../../components/PageHeader';
import MainLayout from '../../layout/MainLayout';

export default function CekMataPage() {
    return (
        <div>

            <section className="font-Raleway bg-gray-50 py-12 px-4 min-h-screen">
                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Gambar Pemeriksaan */}
                        <div className="flex justify-center items-center p-6">
                            <img
                                src="img\cek_mata.jpg" alt="Pemeriksaan Mata"
                                className="max-w-110 h-auto object-cover rounded-lg shadow-md" />
                        </div>

                        {/* Deskripsi dan Form */}
                        <div className="md:w-1/2 p-8">
                            <h5 className="text-2xl font-RalewayBold font-bold [48px] text-primary mb-4">
                                Form Pemeriksaan Mata
                            </h5>
                            <p className="text-gray-600 text-sm mb-6">
                                Isi form di bawah untuk membantu dokter mendiagnosis kondisi mata Anda. Data yang Anda berikan akan dijaga kerahasiaannya.
                            </p>

                            <form className="space-y-4">
                                {/* Nama */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Masukkan nama Anda"
                                    />
                                </div>

                                {/* Keluhan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Keluhan Mata</label>
                                    <textarea
                                        rows="3"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Contoh: Mata terasa perih dan berair..."
                                    />
                                </div>

                                {/* Tingkat Kejelasan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tingkat Kejelasan Penglihatan</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                        <option>Pilih tingkat penglihatan</option>
                                        <option>Jelas</option>
                                        <option>Agak Buram</option>
                                        <option>Sangat Buram</option>
                                        <option>Sulit Melihat Jarak Jauh</option>
                                        <option>Sulit Melihat Jarak Dekat</option>
                                    </select>
                                </div>

                                {/* Upload Foto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Upload Foto Mata</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-600"
                                    />
                                </div>

                                {/* Tombol Submit */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-700"
                                    >
                                        Kirim Pemeriksaan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
