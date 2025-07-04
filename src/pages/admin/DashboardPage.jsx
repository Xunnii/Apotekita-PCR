import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
    MedicineBoxOutlined,
    AppstoreOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import { supabase } from '../../config/supabase';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalObat: 0,
        totalAlkes: 0,
        totalPelanggan: 0,
        totalTransaksi: 0,
        totalPendapatan: 0,
        transaksiHariIni: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Ambil statistik dari semua tabel
            const [
                { count: obatCount },
                { count: alkesCount },
                { count: pelangganCount },
                { count: transaksiCount },
                { data: transaksiData },
                { data: recentTransaksi }
            ] = await Promise.all([
                supabase.from('daftar_obat').select('*', { count: 'exact', head: true }),
                supabase.from('alat_kesehatan').select('*', { count: 'exact', head: true }),
                supabase.from('pelanggan').select('*', { count: 'exact', head: true }),
                supabase.from('riwayat_pembelian').select('*', { count: 'exact', head: true }),
                supabase.from('riwayat_pembelian').select('total_pembelian'),
                supabase.from('riwayat_pembelian')
                    .select('*, pelanggan(nama)')
                    .order('tanggal_transaksi', { ascending: false })
                    .limit(5)
            ]);

            // Hitung total pendapatan
            const totalPendapatan = transaksiData?.reduce((sum, item) => sum + (item.total_pembelian || 0), 0) || 0;

            // Hitung transaksi hari ini
            const today = new Date().toISOString().slice(0, 10);
            const transaksiHariIni = recentTransaksi?.filter(item =>
                item.tanggal_transaksi === today
            ).length || 0;

            setStats({
                totalObat: obatCount || 0,
                totalAlkes: alkesCount || 0,
                totalPelanggan: pelangganCount || 0,
                totalTransaksi: transaksiCount || 0,
                totalPendapatan,
                transaksiHariIni
            });

            setRecentTransactions(recentTransaksi || []);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const transactionColumns = [
        {
            title: 'Tanggal',
            dataIndex: 'tanggal_transaksi',
            key: 'tanggal_transaksi',
            render: (date) => new Date(date).toLocaleDateString('id-ID')
        },
        {
            title: 'Pelanggan',
            dataIndex: ['pelanggan', 'nama'],
            key: 'pelanggan',
            render: (nama) => nama || 'N/A'
        },
        {
            title: 'Produk',
            dataIndex: 'nama_produk',
            key: 'nama_produk'
        },
        {
            title: 'Tipe',
            dataIndex: 'produk_tipe',
            key: 'produk_tipe',
            render: (type) => (
                <Tag color={type === 'obat' ? 'blue' : 'green'}>
                    {type === 'obat' ? 'Obat' : 'Alkes'}
                </Tag>
            )
        },
        {
            title: 'Jumlah',
            dataIndex: 'jumlah',
            key: 'jumlah'
        },
        {
            title: 'Total',
            dataIndex: 'total_pembelian',
            key: 'total_pembelian',
            render: (amount) => `Rp ${amount?.toLocaleString()}`
        },
        {
            title: 'Alamat',
            dataIndex: 'alamat_tujuan',
            key: 'alamat_tujuan'
        },
        {
            title: 'Status',
            dataIndex: 'status_order',
            key: 'status_order',
            render: (status) => (
                <Tag color={
                    status === 'pending' ? 'orange' :
                        status === 'confirmed' ? 'blue' :
                            status === 'shipped' ? 'purple' :
                                status === 'delivered' ? 'green' :
                                    status === 'cancelled' ? 'red' : 'default'
                }>
                    {status}
                </Tag>
            )
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Admin</h1>

                {/* Statistik Cards */}
                <Row gutter={[16, 16]} className="mb-8">
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Obat"
                                value={stats.totalObat}
                                prefix={<MedicineBoxOutlined style={{ color: '#1890ff' }} />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Alat Kesehatan"
                                value={stats.totalAlkes}
                                prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Pelanggan"
                                value={stats.totalPelanggan}
                                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Transaksi"
                                value={stats.totalTransaksi}
                                prefix={<ShoppingCartOutlined style={{ color: '#fa8c16' }} />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Pendapatan dan Transaksi Hari Ini */}
                <Row gutter={[16, 16]} className="mb-8">
                    <Col xs={24} lg={12}>
                        <Card>
                            <Statistic
                                title="Total Pendapatan"
                                value={stats.totalPendapatan}
                                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                                valueStyle={{ color: '#52c41a' }}
                                suffix="Rp"
                                formatter={(value) => value.toLocaleString()}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card>
                            <Statistic
                                title="Transaksi Hari Ini"
                                value={stats.transaksiHariIni}
                                prefix={<LineChartOutlined style={{ color: '#1890ff' }} />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Tabel Transaksi Terbaru */}
                <Card title="Transaksi Terbaru" className="mb-8">
                    <Table
                        columns={transactionColumns}
                        dataSource={recentTransactions}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>

                {/* Quick Actions */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card
                            title="Kelola Obat"
                            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => window.location.href = '/admin/medicine'}
                        >
                            <MedicineBoxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                            <p className="mt-4 text-gray-600">Tambah, edit, atau hapus data obat</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card
                            title="Kelola Alat Kesehatan"
                            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => window.location.href = '/admin/alkes'}
                        >
                            <AppstoreOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                            <p className="mt-4 text-gray-600">Tambah, edit, atau hapus data alkes</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card
                            title="Kelola Pelanggan"
                            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => window.location.href = '/admin/pelanggan'}
                        >
                            <UserOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
                            <p className="mt-4 text-gray-600">Lihat dan kelola data pelanggan</p>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DashboardPage;
