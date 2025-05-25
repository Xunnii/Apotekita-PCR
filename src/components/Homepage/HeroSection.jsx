export default function HeroSection() {
    return (
        <section className="bg-gray-100 py-16 font-Raleway">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="font-RalewayExtra text-[60px] md:text-4xl  text-primary mb-4">
                        Menyediakan Obat dan juga menereima Resep Dokter
                    </h1>
                    <p className="text-gray-600 mb-6">
                        temukan apoteker kami di toko dan konsultasi keluhan anda
                    </p>

                </div>
                <img
                    src="img\Hero1.jpg"
                    alt="Foto"
                    className="w-full h-64 object-cover rounded-md"
                />
            </div>
        </section>
    );
}
