import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailObatPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/data/Obat.json")
            .then((res) => res.json())
            .then((data) => {
                const foundMedicine = data.find((item) => item.id === parseInt(id));
                if (foundMedicine) {
                    setMedicine(foundMedicine);
                } else {
                    navigate("/error-404");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal ambil data JSON:", err);
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

    if (!medicine) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img
                            src={medicine.gambar}
                            alt={medicine.nama_obat}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{medicine.nama_obat}</h1>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Kategori</h2>
                                <p className="text-gray-600">{medicine.kategori}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Harga</h2>
                                <p className="text-blue-600 font-bold">Rp {medicine.harga.toLocaleString()}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Stok</h2>
                                <p className="text-gray-600">{medicine.stok} unit</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Detail</h2>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>Bentuk Sediaan: {medicine.detail.bentuk_sediaan}</li>
                                    <li>Dosis: {medicine.detail.dosis}</li>
                                    <li>Expired: {medicine.detail.expired}</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 