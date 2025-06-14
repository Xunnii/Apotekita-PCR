import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MedicineCard({ id, nama_obat, kategori, harga, gambar }) {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => navigate(`/detail-obat/${id}`)}
        >
            <img src={gambar} alt={nama_obat} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{nama_obat}</h3>
                <p className="text-sm text-gray-600 mb-2">{kategori}</p>
                <p className="text-blue-600 font-semibold text-sm mb-4">Rp {harga.toLocaleString()}</p>
                <button
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic here
                    }}
                >
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}

export default function DaftarObatPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetch("/data/Obat.json")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setFilteredData(json);
            })
            .catch((err) => console.error("Gagal ambil data JSON:", err));
    }, []);

    useEffect(() => {
        const filtered = data.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                item.nama_obat.toLowerCase().includes(searchLower) ||
                item.kategori.toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(filtered);
    }, [searchTerm, data]);

    return (
        <div>
            <section className="font-Raleway bg-gray-50 min-h-screen py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-RalewayExtra text-[32px] text-2xl font-bold text-blue-800 mb-8 text-center">
                        Daftar Obat
                    </h2>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="Cari obat atau kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    <p className="text-gray-600 text-center mb-6">
                        {filteredData.length} obat ditemukan
                    </p>

                    {/* Medicine Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredData.map((item) => (
                            <MedicineCard
                                key={item.id}
                                id={item.id}
                                nama_obat={item.nama_obat}
                                kategori={item.kategori}
                                harga={item.harga}
                                gambar={item.gambar}
                            />
                        ))}
                    </div>

                    {/* No results message */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">
                                Tidak ada obat yang ditemukan
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
