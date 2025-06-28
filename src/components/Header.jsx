import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { AppstoreOutlined, UserOutlined, LoginOutlined, HomeOutlined, MedicineBoxOutlined, EyeOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const items = [
    {
        label: 'Home',
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: 'Apoteker',
        key: '/apoteker',
        icon: <TeamOutlined />,
    },
    {
        label: 'Cek Mata',
        key: '/cek-mata',
        icon: <EyeOutlined />,
    },
    {
        label: 'Daftar Obat',
        key: '/daftar-obat',
        icon: <MedicineBoxOutlined />,
    },
    {
        label: 'Konsultasi Dokter',
        key: '/konsultasi-dokter',
        icon: <AppstoreOutlined />,
    },
];

export default function AppHeader() {
    const [current, setCurrent] = useState('/');
    const navigate = useNavigate();

    const onClick = (e) => {
        setCurrent(e.key);
        navigate(e.key);
    };

    return (
        <Header
            style={{
                background: "#fff",
                boxShadow: "0 2px 8px #f0f1f2",
                padding: "0px 40px",
                display: "flex",
                alignItems: "center",
                zIndex: 50,
            }}
            className="font-Raleway"
        >
            {/* Logo */}
            <div className="mr-20 flex items-center h-full">
                <img src="\img\LogoAK\ak_panjang_nobg.png" alt="Logo" style={{ height: 139 }} />
            </div>
            {/* Menu */}
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{
                    flex: 1,
                    fontSize: 18,
                    borderBottom: "none",
                    display: "flex",
                    justifyContent: "center"
                }}
            />
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4">
                <Button icon={<LoginOutlined />} type="text">
                    Sign In
                </Button>
                <Button icon={<UserOutlined />} type="primary">
                    Sign Up
                </Button>
            </div>
        </Header>
    );
}
