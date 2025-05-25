import medicines from '../data/obat.json';


function MedicineCard({ nama_obat, kategori, harga, gambar }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <img src={gambar} alt={nama_obat} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{nama_obat}</h3>
                <p className="text-sm text-gray-600 mb-2">{kategori}</p>
                <p className="text-blue-600 font-semibold text-sm mb-4">Rp {harga.toLocaleString()}</p>
                <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}

export default function DaftarObatPage() {
    return (
        <div>
            <section className="font-Raleway bg-gray-50 min-h-screen py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-RalewayExtra text-[32px] text-2xl font-bold text-blue-800 mb-8 text-center ">Daftar Obat</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {medicines.map((item) => (
                            <MedicineCard
                                key={item.id}
                                nama_obat={item.nama_obat}
                                kategori={item.kategori}
                                harga={item.harga}
                                gambar={item.gambar}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
