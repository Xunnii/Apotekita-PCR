import { useNavigate } from 'react-router-dom';

export default function ErrorPage({ kode }) {
  const navigate = useNavigate();

  // Konfigurasi pesan dan gambar berdasarkan kode error
  const errorContent = {
    400: {
      title: '400 - Bad Request',
      message: 'Permintaan tidak valid atau ada kesalahan data yang dikirim.',
      image: 'img/400.png', // Ganti sesuai gambar yang kamu miliki
    },
    401: {
      title: '401 - Unauthorized',
      message: 'Anda belum login atau tidak memiliki akses ke halaman ini.',
      image: 'img/401.png',
    },
    403: {
      title: '403 - Forbidden',
      message: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
      image: 'img/403.png',
    },
    404: {
      title: '404 - Not Found',
      message: 'Halaman yang Anda cari tidak ditemukan.',
      image: 'img/404.png',
    },
  };

  const { title, message, image } = errorContent[kode] || errorContent[404];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <img
          src={image}
          alt={`Ilustrasi ${kode}`}
          className="mx-auto w-60 h-60 object-contain mb-6"
        />
        <h1 className="text-3xl font-bold text-red-600 mb-2">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
