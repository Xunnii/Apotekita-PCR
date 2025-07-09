import React, { useState } from "react";
import { Card } from "antd";
import { AiFillMedicineBox, AiFillFileAdd } from "react-icons/ai";
import { CiStethoscope } from "react-icons/ci";
import { AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ShoppingCartOutlined } from "@ant-design/icons";

const tabList = [
    {
        key: "obat",
        tab: (
            <span>
                <AiFillMedicineBox className="inline mr-2" />
                Obat
            </span>
        ),
    },
    {
        key: "konsultasi",
        tab: (
            <span>
                <CiStethoscope className="inline mr-2" />
                Konsultasi
            </span>
        ),
    },
    {
        key: "cek-mata",
        tab: (
            <span>
                <AiFillEye className="inline mr-2" />
                Admin
            </span>
        ),
    },
    {
        key: "keranjang",
        tab: (
            <span>
                <ShoppingCartOutlined className="inline mr-2" />
                Keranjang
            </span>
        ),
    },
    {
        key: "resep",
        tab: (
            <span>
                <AiFillFileAdd className="inline mr-2" />
                Resep
            </span>
        ),
    },
];

const contentList = {
    obat: (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Daftar Obat</h3>
            <p>Informasi dan daftar obat yang tersedia di apotek kami</p>
            <Link
                to="/daftar-obat"
                className="inline-block mt-4 px-6 py-2 bg-[#A63D3D] text-white rounded shadow hover:bg-[#922c2c] transition"
            >
                Lihat Daftar Obat
            </Link>
        </div>
    ),
    konsultasi: (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Konsultasi Dokter</h3>
            <p>Layanan konsultasi dengan dokter dan apoteker profesional.</p>
            <Link
                to="/daftar-alkes"
                className="inline-block mt-4 px-6 py-2 bg-[#A63D3D] text-white rounded shadow hover:bg-[#922c2c] transition"
            >
                Lihat daftar Alat Kesehatan
            </Link>
        </div>
    ),
    "cek-mata": (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-2">admin</h3>
            <p>testing Tombol Admin</p>
            <Link
                to="/admin/"
                className="inline-block mt-4 px-6 py-2 bg-[#A63D3D] text-white rounded shadow hover:bg-[#922c2c] transition"
            >
                Masuk ke admin
            </Link>
        </div>
    ),
    keranjang: (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Keranjang</h3>
            <p>Halaman keranjang belanja Anda.</p>
            <Link
                to="/keranjang"
                className="inline-block mt-4 px-6 py-2 bg-[#A63D3D] text-white rounded shadow hover:bg-[#922c2c] transition"
            >
                Lihat Keranjang
            </Link>
        </div>
    ),
    resep: (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Kirim Resep</h3>
            <p>Kirim foto resep obat Anda secara online, praktis dan mudah!</p>
            <Link
                to="/kirim-resep"
                className="inline-block mt-4 px-6 py-2 bg-[#A63D3D] text-white rounded shadow hover:bg-[#922c2c] transition"
            >
                Kirim Resep Obat
            </Link>
        </div>
    ),
};

const FeaturesWithTabs = () => {
    const [activeTabKey, setActiveTabKey] = useState("obat");

    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

    return (
        <section className="bg-white py-16 font-Raleway">
            <div className="container mx-auto px-4 flex justify-center">
                <Card
                    style={{ width: 1431 }}
                    tabList={tabList}
                    activeTabKey={activeTabKey}
                    onTabChange={onTabChange}
                    headStyle={{ textAlign: "center" }}
                    title={<span className="block text-5xl font-Palisade text-primary">Fitur Apotek</span>}
                >
                    {contentList[activeTabKey]}
                </Card>
            </div>
        </section>
    );
};

export default FeaturesWithTabs;