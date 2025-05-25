// src/pages/Error403.jsx
import { Link } from "react-router-dom";

export default function Error403() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <img
                src="src/assets/403.png"
                alt="403 - Forbidden"
                className="w-96 h-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-yellow-600 mb-2">403 - Forbidden</h1>
            <p className="text-gray-600 mb-6 text-center">
                Akses ke halaman ini dilarang.
            </p>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Kembali ke Beranda
            </Link>
        </div>
    );
}
