import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    EditOutlined,
    AppstoreOutlined,
    MedicineBoxOutlined,
    TeamOutlined,
    BarChartOutlined,
    StarOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
    {
        key: '/admin/',
        icon: <HomeOutlined />,
        label: 'Dashboard',
    },
    {
        key: '/admin/prediksi-stok',
        icon: <EditOutlined />,
        label: 'Prediksi Stok Obat',
    },
    // {
    //     key: '/admin/notes',
    //     icon: <EditOutlined />,
    //     label: 'Notes',
    // },
    {
        key: '/admin/blank',
        icon: <AppstoreOutlined />,
        label: 'Blank',
    },
    {
        key: '/admin/medicine',
        icon: <MedicineBoxOutlined />,
        label: 'Medicine',
    },
    {
        key: '/admin/alkes',
        icon: <AppstoreOutlined />,
        label: 'Alkes',
    },
    {
        key: '/admin/pelanggan',
        icon: <TeamOutlined />,
        label: 'Pelanggan',
    },
    {
        key: '/admin/riwayat-pembelian',
        icon: <AppstoreOutlined />,
        label: 'Riwayat Pembelian',
    },
    {
        key: '/admin/laporan-penjualan',
        icon: <BarChartOutlined />,
        label: 'Laporan Penjualan',
    },
    // {
    //     key: '/admin/konsultasi-dokter',
    //     icon: <TeamOutlined />,
    //     label: 'Konsultasi',
    // },
    {
        key: '/admin/testimoni',
        icon: <StarOutlined />,
        label: 'Testimoni',
    },
];

export default function Sidebar({ sidebarToggle, setSidebarToggle }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (

        <Sider
            width={sidebarToggle ? 250 : 80}
            collapsible
            collapsed={!sidebarToggle}
            onCollapse={collapsed => setSidebarToggle(!collapsed)}
            style={{
                background: '#fff',
                minHeight: '100vh',
                boxShadow: '8px 0 8px #f0f1f2',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 50,
            }}
        >
            <div className="flex items-center justify-center py-6">
                <span className="text-2xl font-bold text-gray-900">Apotekita</span>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                items={menuItems}
                style={{ borderRight: 0, fontWeight: 500, fontSize: 16 }}
            />
        </Sider>

    );
}
