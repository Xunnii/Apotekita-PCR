import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from 'antd';
import { supabase } from '../../config/supabase';

function AlkesCard({ id, nama_alkes, harga_alkes, gambar }) {
    const navigate = useNavigate();

    const handleAddToCart = async (alkes) => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            navigate('/login');
            return;
        }
        // Tambahkan ke keranjang (localStorage)
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(alkes);
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <Card
            hoverable
            cover={<img alt={nama_alkes} src={gambar} style={{ height: 200, objectFit: 'cover' }} />}
            onClick={() => navigate(`/detail-alkes/${id}`)}
            style={{ cursor: 'pointer' }}
        >
            <Card.Meta
                title={nama_alkes}
                description={
                    <>
                        <div style={{ color: '#1677ff', fontWeight: 600, marginBottom: 16 }}>
                            Rp {harga_alkes?.toLocaleString()}
                        </div>
                        <Button
                            type="primary"
                            onClick={e => {
                                e.stopPropagation();
                                handleAddToCart({ id, nama_alkes, harga_alkes, gambar });
                            }}
                        >
                            Tambah ke Keranjang
                        </Button>
                    </>
                }
            />
        </Card>
    );
}

export default function DaftarAlkesPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Ambil data dari Supabase
        supabase
            .from('alat_kesehatan')
            .select('*')
            .then(({ data, error }) => {
                if (!error) {
                    setData(data);
                    setFilteredData(data);
                }
            });
    }, []);

    useEffect(() => {
        const filtered = data.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (item.nama_alkes || '').toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(filtered);
    }, [searchTerm, data]);

    return (
        <div>
            <section className="font-Raleway bg-gray-50 min-h-screen py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-RalewayExtra text-[32px] text-2xl font-bold text-blue-800 mb-8 text-center">
                        Daftar Alat Kesehatan
                    </h2>
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="Cari alat kesehatan..."
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
                        {filteredData.length} alat kesehatan ditemukan
                    </p>
                    {/* Alkes Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredData.map((item) => (
                            <AlkesCard
                                key={item.id}
                                id={item.id}
                                nama_alkes={item.nama_alkes}
                                harga_alkes={item.harga_alkes}
                                gambar={item.gambar}
                            />
                        ))}
                    </div>
                    {/* No results message */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">
                                Tidak ada alat kesehatan yang ditemukan
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

