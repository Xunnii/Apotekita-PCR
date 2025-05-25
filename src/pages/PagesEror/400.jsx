// src/pages/Error400.jsx
import { Link } from "react-router-dom";

export default function Error400() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <img
                src="src/assets/400.png"
                alt="400 - Bad Request"
                className="w-96 h-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-red-600 mb-2">400 - Bad Request</h1>
            <p className="text-gray-600 mb-6 text-center">
                Permintaan tidak valid. Silakan periksa kembali.
            </p>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Kembali ke Beranda
            </Link>
        </div>
    );
}
