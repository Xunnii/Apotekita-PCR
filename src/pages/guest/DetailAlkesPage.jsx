import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '../../config/supabase';

export default function DetailAlkesPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alkes, setAlkes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from('alat_kesehatan')
            .select('*')
            .eq('id', id)
            .single()
            .then(({ data, error }) => {
                if (data) {
                    setAlkes(data);
                } else {
                    navigate("/error-404");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal ambil data dari Supabase:", err);
                setLoading(false);
            });
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                                <p className="text-gray-600">{alkes.stok_alkes} unit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

