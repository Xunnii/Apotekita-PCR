import { useState, useEffect } from "react";
import { getApprovedTestimoni } from '../../services/profileService';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true);
            const { data, error } = await getApprovedTestimoni();
            if (!error && data) {
                setTestimonials(data);
            }
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
    const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

    if (loading) {
        return <div className="py-20 text-center">Loading testimonials...</div>;
    }
    if (!testimonials.length) {
        return <div className="py-20 text-center text-gray-500">Belum ada testimoni.</div>;
    }

    const current = testimonials[index];
    const pelanggan = current.pelanggan || {};

    return (
        <section className="bg-[#f4f4f4] py-20 font-Raleway">
            <div className="container mx-auto px-4">
                <h2 className="text-7xl font-Palisade text-primary  mb-6 text-center leading-tight">
                    Testimoni Pelanggan
                </h2>
                <p className="text-xl text-black mb-12 max-w-2xl mx-auto text-center">
                    Apa kata mereka tentang layanan kami?
                </p>
                <div className="flex items-center justify-center">
                    {/* Prev Button */}
                    <button
                        onClick={prev}
                        className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mr-4 md:mr-8 text-2xl text-[#A63D3D] hover:bg-gray-200 transition"
                        aria-label="Previous"
                    >
                        &lt;
                    </button>
                    {/* Testimonial Card */}
                    <div className="bg-white rounded-xl shadow p-4 md:p-12 flex flex-col md:flex-row items-center w-full max-w-5xl">
                        {/* Foto Profil atau Avatar */}
                        {pelanggan.foto_profil ? (
                            <img
                                src={pelanggan.foto_profil}
                                alt={pelanggan.nama || 'Foto Profil'}
                                className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover border mb-6 md:mb-0 md:mr-10 flex-shrink-0"
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-40 md:h-40 bg-gray-300 rounded-full mb-6 md:mb-0 md:mr-10 flex items-center justify-center text-5xl text-gray-400 flex-shrink-0">
                                <span role="img" aria-label="avatar">👤</span>
                            </div>
                        )}
                        <div className="text-left w-full">
                            <p className="font-bold text-lg md:text-2xl mb-4">{current.quote}</p>
                            <div className="flex items-center mb-2">
                                {/* Rating bintang */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < (current.rating || 0) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>★</span>
                                ))}
                            </div>
                            <p className="font-bold text-xl mb-1">{pelanggan.nama || '-'}</p>
                            <p className="text-gray-500 text-sm">{new Date(current.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                    {/* Next Button */}
                    <button
                        onClick={next}
                        className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center ml-4 md:ml-8 text-2xl text-[#A63D3D] hover:bg-gray-200 transition"
                        aria-label="Next"
                    >
                        &gt;
                    </button>
                </div>
                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, i) => (
                        <span
                            key={i}
                            className={`w-3 h-3 rounded-full ${i === index ? "bg-[#A63D3D]" : "bg-gray-300"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
