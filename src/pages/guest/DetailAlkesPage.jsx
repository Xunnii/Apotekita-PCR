import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '../../config/supabase';

export default function DetailAlkesPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alkes, setAlkes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlkes = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('alat_kesehatan')
                    .select('*')
                    .eq('id', parseInt(id))
                    .single();

                if (error) {
                    console.error("Error fetching alkes:", error);
                    setError('Gagal mengambil data alat kesehatan');
                    navigate("/error-404");
                    return;
                }

                if (data) {
                    setAlkes(data);
                } else {
                    navigate("/error-404");
                }
            } catch (err) {
                console.error("Gagal ambil data:", err);
                setError('Terjadi kesalahan saat mengambil data');
                navigate("/error-404");
            } finally {
                setLoading(false);
            }
        };

        fetchAlkes();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            navigate('/login');
            return;
        }

        // Tambahkan ke keranjang (localStorage)
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === alkes.id && item.type === 'alkes');

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: alkes.id,
                type: 'alkes',
                nama: alkes.nama_alkes,
                harga: alkes.harga_alkes,
                gambar: alkes.gambar,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Alat kesehatan berhasil ditambahkan ke keranjang!');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!alkes) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img
                            src={alkes.gambar}
                            alt={alkes.nama_alkes}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{alkes.nama_alkes}</h1>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Harga</h2>
                                <p className="text-blue-600 font-bold">Rp {alkes.harga_alkes?.toLocaleString()}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Stok</h2>
                                <p className="text-gray-600">{alkes.stok_alkes || 0} unit</p>
                            </div>
                            {alkes.deskripsi && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">Deskripsi</h2>
                                    <p className="text-gray-600">{alkes.deskripsi}</p>
                                </div>
                            )}
                            <div className="pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                >
                                    Tambah ke Keranjang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

