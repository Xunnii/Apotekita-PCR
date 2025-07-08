import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function NewsSection() {
    const artikelRef = useRef(null);

    useEffect(() => {
        if (artikelRef.current) {
            console.log("artikelRef", artikelRef.current); // debug
            gsap.fromTo(
                artikelRef.current,
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: artikelRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                }
            );
        }
    }, []);

    return (
        <section className="bg-gray-50 py-10">
            <div className="container mx-auto px-2 text-center">
                <h2 className="text-6xl font-Palisade-bold font-Palisade text-primary mb-4">Artikel Kesehatan</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src="/img/About/Mengenal-Metode-Hypnotherapy-untuk-Kesehatan-Psikologis.jpg.webp"
                        alt="Hero News"
                        className="h-[400px] w-[669px] object-cover rounded shadow-lg"
                    />
                    <div className="w-[835px] h-[363px] text-left">
                        <h3 className="text-md font-semibold mb-2">Manfaat Olahraga Rutin untuk Kesehatan</h3>
                        <div
                            ref={artikelRef}
                            className="bg-gray-100 p-4 h-90 overflow-y-auto"
                            style={{ opacity: 1 }} // fallback agar tetap terlihat
                        >
                            <p className="text-gray-700 text-sm">
                                <b>Apa Itu Kesehatan Mental?</b><br /><br />
                                Kesehatan jiwa atau sebutan lainnya kesehatan mental adalah kesehatan yang berkaitan dengan kondisi emosi, kejiwaan, dan psikis seseorang.<br /><br />
                                Perlu kamu ketahui bahwa peristiwa dalam hidup yang berdampak besar pada kepribadian dan perilaku seseorang bisa berpengaruh pada kesehatan mentalnya.<br /><br />
                                Misalnya, pelecehan saat usia dini, stres berat dalam jangka waktu lama tanpa adanya penanganan, dan mengalami kekerasan dalam rumah tangga.<br /><br />
                                Berbagai kondisi tersebut bisa membuat kondisi kejiwaan seseorang terganggu, sehingga muncul gejala gangguan kesehatan jiwa.<br /><br />
                                Akan tetapi, masalah kesehatan mental bisa mengubah cara seseorang dalam mengatasi stres, berhubungan dengan orang lain, membuat pilihan, dan memicu hasrat untuk menyakiti diri sendiri.<br /><br />
                                Beberapa jenis gangguan mental yang umum terjadi antara lain depresi, gangguan bipolar, kecemasan, gangguan stres pasca trauma (PTSD), gangguan obsesif kompulsif (OCD), dan psikosis.<br /><br />
                                Selain itu, ada beberapa penyakit mental hanya terjadi pada jenis pengidap tertentu, seperti postpartum depression hanya menyerang ibu setelah melahirkan.
                            </p>
                        </div>
                        <a href="https://www.halodoc.com/kesehatan/kesehatan-mental?srsltid=AfmBOopsZ_ZYCdmhXR59ysEqpjOyx5Mq8RkwneHz1RxF4X4kK4Qo9iZF" className="text-primary text-md hover:underline mt-2 inline-block">
                            Baca Selengkapnya →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
