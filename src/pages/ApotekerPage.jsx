import MainLayout from '../layout/MainLayout';


export default function ApotekerPage() {
    return (
        <div >
            <section className="font-Raleway bg-white py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <img
                        src="img\Apoteker1.jpg" // Ganti dengan path gambarmu sendiri di public/images/
                        alt="Foto Apoteker"
                        className="w-48 h-48 rounded-full mx-auto object-cover mb-6 shadow-lg"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Dr. Cipeng Tirta, Apt.</h2>
                    <p className="text-sm text-gray-500 mb-4">Apoteker Senior • Universitas Gadjah Mada</p>
                    <p className="text-gray-700 leading-relaxed text-justify px-4 md:px-12">
                        Dr. Cipeng Tirta adalah apoteker berpengalaman yang telah bekerja di bidang farmasi selama lebih dari 15 tahun.
                        Ia memiliki keahlian dalam farmakologi klinis, manajemen obat, dan pelayanan kesehatan berbasis komunitas.
                        Saat ini, beliau bertugas sebagai kepala apotek di Rumah Sehat Medika dan aktif dalam edukasi masyarakat tentang penggunaan obat yang rasional.
                    </p>
                </div>
            </section>
        </div>
    );
}
