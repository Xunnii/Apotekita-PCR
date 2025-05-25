import { FaStethoscope } from "react-icons/fa";
import { CiStethoscope } from "react-icons/ci";
import { AiFillEye } from "react-icons/ai";
// src/components/Features.jsx
import { AiFillMedicineBox } from "react-icons/ai";
import { FaFileAlt, FaFlask } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link untuk routing



function FeatureCard({ icon, title, desc, link }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex items-center justify-center text-4xl text-blue-600 mb-4">{icon}</div>
            <h3 className="text-lg font-RalewayBold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{desc}</p>
            <Link to={link} className="text-orange-500 text-sm hover:underline">Klik Disini</Link>

            <Link></Link>
        </div>
    );
}

export default function Features() {
    return (
        <section className="bg-gray-50 py-16 font-Raleway">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<AiFillMedicineBox />}
                    title="Daftar Obat"
                    desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    link="/daftar-obat"  // Link ke halaman Daftar Obat
                />
                <FeatureCard
                    icon={<CiStethoscope />}
                    title="Konsultasi Dokter"
                    desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    link="/konsultasi-dokter"  // Link ke halaman Konsultasi Dokter
                />
                <FeatureCard
                    icon={<AiFillEye />}
                    title="Cek Mata"
                    desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    link="/cek-mata"  // Link ke halaman Cek Mata
                />
            </div>
        </section>
    );
}