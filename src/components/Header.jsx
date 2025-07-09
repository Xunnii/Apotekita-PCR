import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Drawer } from "antd";
import {
    AppstoreOutlined,
    UserOutlined,
    LoginOutlined,
    HomeOutlined,
    MedicineBoxOutlined,
    EyeOutlined,
    TeamOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    SettingOutlined,
    ProfileOutlined,
    MenuOutlined,
    StarOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from '../config/supabase';
import { getPelangganById } from '../services/profileService';

const { Header } = Layout;

const items = [
    {
        label: 'Home',
        key: '/',
        icon: <HomeOutlined />,
    },
    // {
    //     label: 'Apoteker',
    //     key: '/apoteker',
    //     icon: <TeamOutlined />,
    // },
    // // {
    // //     label: 'Cek Mata',
    // //     key: '/cek-mata',
    // //     icon: <EyeOutlined />,
    // // },
    {
        label: 'Daftar Obat',
        key: '/daftar-obat',
        icon: <MedicineBoxOutlined />,
    },
    {
        label: 'Daftar Alat Kesehatan',
        key: '/daftar-alkes',
        icon: <AppstoreOutlined />,
    },
    {
        label: 'FAQ',
        key: '/faq',
        icon: <AppstoreOutlined />,
    },

    {
        label: 'Outlet Kami',
        key: '/',
        icon: <AppstoreOutlined />,
    },
    // {
    //     label: 'Konsultasi Dokter',
    //     key: '/konsultasi-dokter',
    //     icon: <AppstoreOutlined />,
    // },
];

export default function AppHeader() {
    const [current, setCurrent] = useState('/');
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (session && session.user) {
                const { data } = await getPelangganById(session.user.id);
                setProfile(data);
            } else {
                setProfile(null);
            }
        };
        fetchProfile();
    }, [session]);

    // Update cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(totalQuantity);
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    const onClick = (e) => {
        setCurrent(e.key);
        navigate(e.key);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // Dropdown items untuk user yang sudah login
    const userMenuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => navigate('/profile')
        },
        {
            type: 'divider'
        },
        {
            key: 'keranjang',
            icon: <ShoppingCartOutlined />,
            label: 'Keranjang',
            onClick: () => navigate('/keranjang')
        },
        {
            key: 'Riwayat Pembelian',
            icon: <ClockCircleOutlined />,
            label: 'Riwayat Pembelian',
            onClick: () => navigate('/Riwayat-Pembelian')
        },
        {
            key: 'testimoni',
            icon: <StarOutlined />,
            label: 'Beri Testimoni',
            onClick: () => navigate('/testimoni')
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout
        }
    ];

    // Dropdown items untuk user yang belum login
    const guestMenuItems = [
        {
            key: 'login',
            icon: <LoginOutlined />,
            label: 'Sign In',
            onClick: () => navigate('/login')
        },
        {
            key: 'register',
            icon: <UserOutlined />,
            label: 'Sign Up',
            onClick: () => navigate('/register')
        }
    ];

    // Mobile menu items (gabungkan navigation dan auth)
    const mobileMenuItems = [
        ...items,
        { type: 'divider' },
        ...(session ? userMenuItems : guestMenuItems)
    ];

    const handleMobileMenuClick = (e) => {
        setCurrent(e.key);
        setDrawerOpen(false); // Tutup drawer setelah klik
        navigate(e.key);
    };

    return (
        <Header
            style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                padding: "0px 20px",
                display: "flex",
                alignItems: "center",
                zIndex: 50,
                position: "sticky",
                top: 0,
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            }}
            className="font-Raleway"
        >
            {/* Mobile Header: Hamburger, Logo, Profile */}
            <div className="flex w-full items-center justify-between md:hidden">
                {/* Hamburger */}
                <Button
                    icon={<MenuOutlined />}
                    style={{ border: 'none', background: 'none', boxShadow: 'none' }}
                    aria-label="Menu"
                    onClick={() => setDrawerOpen(true)}
                />
                {/* Logo */}
                <img
                    src="/img/LogoAK/ak_panjang_nobg.png"
                    alt="Logo"
                    className="h-14 md:h-28 w-auto"
                />
                {/* Profile/Guest */}
                {session ? (
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        arrow
                        trigger={['click']}
                    >
                        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors">
                            <Avatar
                                size={32}
                                src={profile?.foto_profil || null}
                                icon={!profile?.foto_profil && <UserOutlined />}
                                style={{
                                    backgroundColor: profile?.foto_profil ? undefined : (profile?.nama ? '#1890ff' : '#d9d9d9'),
                                    color: profile?.foto_profil ? undefined : (profile?.nama ? '#fff' : '#666')
                                }}
                            />
                        </div>
                    </Dropdown>
                ) : (
                    <Dropdown
                        menu={{ items: guestMenuItems }}
                        placement="bottomRight"
                        arrow
                        trigger={['click']}
                    >
                        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors">
                            <UserOutlined style={{ fontSize: 24, color: '#666' }} />
                        </div>
                    </Dropdown>
                )}
            </div>
            {/* Desktop Header: Logo, Menu, Cart, Profile */}
            <>
                <div className="mr-8 md:mr-20 items-center h-full hidden md:flex">
                    <img
                        src="/img/LogoAK/ak_panjang_nobg.png"
                        alt="Logo"
                        className="h-14 md:h-30"
                    />
                </div>
                {/* Menu Desktop */}
                <div className="hidden md:flex flex-1">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            borderBottom: "none",
                            display: "flex",
                            justifyContent: "center"
                        }}
                    />
                </div>
                {/* Cart Icon & Profile Desktop */}
                <div className="items-center space-x-4 ml-4 hidden md:flex">
                    <Badge count={cartCount} size="small" offset={[0, 6]}>
                        <Button
                            shape="circle"
                            icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                            onClick={() => navigate('/keranjang')}
                            style={{ border: 'none', background: 'none', boxShadow: 'none' }}
                            aria-label="Keranjang"
                        />
                    </Badge>
                    {session ? (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                            trigger={['click']}
                        >
                            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors">
                                <Avatar
                                    size={45}
                                    src={profile?.foto_profil || null}
                                    icon={!profile?.foto_profil && <UserOutlined />}
                                    style={{
                                        backgroundColor: profile?.foto_profil ? undefined : (profile?.nama ? '#1890ff' : '#d9d9d9'),
                                        color: profile?.foto_profil ? undefined : (profile?.nama ? '#fff' : '#666')
                                    }}
                                />
                                <div className="ml-2">
                                    <div className="text-sm font-medium text-gray-700">
                                        {profile?.nama || 'User'}
                                    </div>
                                </div>
                            </div>
                        </Dropdown>
                    ) : (
                        <Dropdown
                            menu={{ items: guestMenuItems }}
                            placement="bottomRight"
                            arrow
                            trigger={['click']}
                        >
                            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors">
                                <div>
                                    <div className="text-sm font-medium text-gray-700">
                                        Guest
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Sign in to continue
                                    </div>
                                </div>
                            </div>
                        </Dropdown>
                    )}
                </div>
            </>
            {/* Drawer untuk Mobile Menu */}
            <Drawer
                title={<span className="font-bold text-lg">Menu</span>}
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                className="md:hidden"
                bodyStyle={{ padding: 0 }}
            >
                <Menu
                    onClick={handleMobileMenuClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={mobileMenuItems}
                    style={{ border: 'none' }}
                />
            </Drawer>
        </Header>
    );
}
