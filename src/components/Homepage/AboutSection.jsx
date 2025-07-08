export default function InfoSection() {
    return (
        <section className="bg-gray-100 py-24 font-Raleway">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Kiri: Gambar/Placeholder */}
                <div>
                    <img
                        src="/img/About/image-about.webp"
                        alt="Tentang Apotek Keluarga"
                        className="w-full h-[400px] object-cover rounded-md shadow-lg"
                    />
                </div>
                {/* Kanan: Teks */}
                <div>
                    <h2 className="text-6xl text-primary font-Palisade  mb-6">Tentang Kami</h2>
                    <p className="text-gray-800 text-lg mb-8 leading-relaxed">
                        Apotek Keluarga Pekanbaru adalah apotek terpercaya yang hadir untuk memenuhi kebutuhan kesehatan masyarakat dengan pelayanan yang cepat, ramah, dan profesional. Berdiri di tengah kota Pekanbaru, kami berkomitmen menyediakan produk obat-obatan yang lengkap, berkualitas, serta layanan konsultasi yang informatif demi mendukung gaya hidup sehat keluarga Indonesia.
                        <br />
                        Kami tidak hanya melayani penjualan obat resep dan non-resep, tetapi juga menyediakan produk kesehatan lainnya seperti suplemen, alat kesehatan, dan produk herbal pilihan. Dengan tenaga farmasi berpengalaman dan sistem pelayanan yang terus berkembang, Apotek Keluarga siap menjadi mitra terbaik Anda dalam menjaga kesehatan.
                    </p>

                </div>
            </div>
        </section>
    );
} 