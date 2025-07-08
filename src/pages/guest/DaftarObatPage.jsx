import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Modal, InputNumber } from 'antd';
import { supabase } from '../../config/supabase';

function MedicineCard({ id, nama_obat, kategori, harga, gambar }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [qty, setQty] = useState(1);

    const handleAddToCart = async (obat) => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            navigate('/login');
            return;
        }
        // Tambahkan ke keranjang (localStorage)
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            id: obat.id,
            type: 'obat',
            nama: obat.nama_obat,
            harga: obat.harga,
            gambar: obat.gambar,
            quantity: obat.quantity || 1
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <>
            <Card
                hoverable
                cover={
                    <div className="w-full h-52 bg-white flex items-center justify-center overflow-hidden">
                        <img
                            alt={nama_obat}
                            src={gambar}
                            className="max-w-full max-h-full object-contain mx-auto block"
                        />
                    </div>
                }
                onClick={() => navigate(`/detail-obat/${id}`)}
                style={{ cursor: 'pointer' }}
            >
                <Card.Meta
                    title={nama_obat}
                    description={
                        <>
                            <div style={{ color: '#888', marginBottom: 8 }}>{kategori}</div>
                            <div style={{ color: '#1677ff', fontWeight: 600, marginBottom: 16 }}>
                                Rp {harga.toLocaleString()}
                            </div>
                            <Button
                                type="primary"
                                onClick={e => {
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}
                            >
                                Tambah ke Keranjang
                            </Button>
                        </>
                    }
                />
            </Card>
            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={() => {
                    handleAddToCart({ id, nama_obat, harga, gambar, quantity: qty });
                    setShowModal(false);
                    setQty(1);
                }}
                title="Pilih Jumlah"
                okText="Tambah"
                cancelText="Batal"
            >
                <div className="mb-2">Jumlah:</div>
                <InputNumber min={1} value={qty} onChange={setQty} />
            </Modal>
        </>
    );
}

export default function DaftarObatPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Ambil data dari Supabase
        supabase
            .from('daftar_obat')
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
                (item.nama_obat || '').toLowerCase().includes(searchLower) ||
                (item.kategori || '').toLowerCase().includes(searchLower)
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
                                kategori={item.kategori || ''}
                                harga={item.harga_obat}
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
