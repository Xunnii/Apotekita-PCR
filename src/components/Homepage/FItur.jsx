import { FaStethoscope } from "react-icons/fa";
import { CiStethoscope } from "react-icons/ci";
import { AiFillEye } from "react-icons/ai";
// src/components/Features.jsx
import { AiFillMedicineBox } from "react-icons/ai";
import { FaFileAlt, FaFlask } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link untuk routing
import { Card } from 'antd';

function FeatureCard({ icon, title, desc, link }) {
    return (
        <Card
            hoverable
            className="rounded-lg text-center transition-transform duration-200 shadow group"
            style={{ minHeight: 340 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
            <div className="flex items-center justify-center mb-4">
                <div className="bg-[#A63D3D] text-white rounded-full w-20 h-20 flex items-center justify-center text-4xl mb-2">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-[#A63D3D] mb-4">{title}</h3>
            <p className="text-gray-800 text-lg mb-8">{desc}</p>
            <Link to={link} className="text-[#C25B3D] font-semibold text-base flex items-center hover:underline transition">
                Comes froe <span className="ml-2 text-xl">&rarr;</span>
            </Link>
        </Card>
    );
}

export default function Features() {
    return (
        <section className="bg-white py-16 font-Raleway">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
                <FeatureCard
                    icon={<AiFillMedicineBox />}
                    title="Typesetting"
                    desc="Lorem ipume dolor sit amet, consectetur adipiscing elit. Duis euismod id magna vel tempor."
                    link="/daftar-obat"
                />
                <FeatureCard
                    icon={<CiStethoscope />}
                    title="Readabli"
                    desc="Lorem ipume dolor sit amet, consectetur adipiscing elit. Duis euismod id magna vel tempor."
                    link="/konsultasi-dokter"
                />
                <FeatureCard
                    icon={<AiFillEye />}
                    title="Sometimes The"
                    desc="Lorem ipume dolor sit amet, consectetur adipiscing elit. Duis euismod id magna vel tempor."
                    link="/cek-mata"
                />
            </div>
        </section>
    );
}