// src/pages/Error401.jsx
import { Link } from "react-router-dom";

export default function Error401() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <img
                src="src/assets/401.png"
                alt="401 - Unauthorized"
                className="w-96 h-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-orange-600 mb-2">401 - Unauthorized</h1>
            <p className="text-gray-600 mb-6 text-center">
                Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Kembali ke Beranda
            </Link>
        </div>
    );
}
