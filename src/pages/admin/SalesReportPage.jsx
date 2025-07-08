import React, { useState, useEffect } from "react";
import { salesReportService } from '../../services/salesReportService';
import AlertBox from '../../components/Note/AlertBox';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { Table, Card, Row, Col, DatePicker, Select, Button, Statistic } from 'antd';
import { LineChartOutlined, ShoppingCartOutlined, DollarOutlined, BarChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const { RangePicker } = DatePicker;

export default function SalesReportPage() {
    const [salesData, setSalesData] = useState([]);
    const [salesStats, setSalesStats] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        status: '',
        produk_tipe: ''
    });

    // Load sales report data
    const loadSalesReport = async () => {
        try {
            setLoading(true);
            setError("");

            // Load sales data
            const salesReport = await salesReportService.getSalesReport(filters);
            setSalesData(salesReport || []);

            // Load statistics
            const stats = await salesReportService.getSalesStats(filters);
            setSalesStats(stats || {});

            // Load top products
            const topSelling = await salesReportService.getTopSellingProducts(5, filters);
            setTopProducts(topSelling || []);

        } catch (err) {
            console.error('Error loading sales report:', err);
            setError("Gagal memuat laporan penjualan. Pastikan tabel riwayat_pembelian sudah dibuat.");
            // Set default values
            setSalesData([]);
            setSalesStats({
                totalRevenue: 0,
                totalItems: 0,
                totalTransactions: 0,
                productTypeStats: {},
                averageOrderValue: 0
            });
            setTopProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSalesReport();
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle date range change
    const handleDateRangeChange = (dates) => {
        if (dates) {
            setFilters(prev => ({
                ...prev,
                startDate: dates[0].format('YYYY-MM-DD'),
                endDate: dates[1].format('YYYY-MM-DD')
            }));
        }
    };

    // Table columns for sales data
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 60
        },
        {
            title: 'Produk',
            dataIndex: 'produk',
            key: 'produk',
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-xs text-gray-500 capitalize">{record.tipe_produk}</div>
                </div>
            )
        },
        {
            title: 'Total Produk',
            dataIndex: 'total_produk',
            key: 'total_produk',
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            title: 'Total Pembelian',
            dataIndex: 'total_pembelian',
            key: 'total_pembelian',
            render: (value) => <span className="font-medium text-green-600">Rp {value.toLocaleString()}</span>
        },
        {
            title: 'Tanggal Transaksi',
            dataIndex: 'tanggal_transaksi',
            key: 'tanggal_transaksi',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusColors = {
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'processing': 'bg-blue-100 text-blue-800',
                    'shipped': 'bg-purple-100 text-purple-800',
                    'delivered': 'bg-green-100 text-green-800',
                    'cancelled': 'bg-red-100 text-red-800'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            title: 'Pelanggan',
            dataIndex: 'pelanggan',
            key: 'pelanggan',
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    {record.pelanggan_email && (
                        <div className="text-xs text-gray-500">{record.pelanggan_email}</div>
                    )}
                </div>
            )
        }
    ];

    // Table columns for top products
    const topProductsColumns = [
        {
            title: 'Produk',
            dataIndex: 'nama',
            key: 'nama',
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-xs text-gray-500 capitalize">{record.tipe}</div>
                </div>
            )
        },
        {
            title: 'Total Terjual',
            dataIndex: 'total_terjual',
            key: 'total_terjual',
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            title: 'Total Revenue',
            dataIndex: 'total_revenue',
            key: 'total_revenue',
            render: (value) => <span className="font-medium text-green-600">Rp {value.toLocaleString()}</span>
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Laporan Penjualan
                </h2>
                <p className="text-gray-600">
                    Analisis data penjualan dan performa produk
                </p>
                {salesData.length > 0 && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                            ✅ Data berhasil dimuat: {salesData.length} transaksi ditemukan
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <AlertBox type="error">
                    <div>
                        <p className="font-semibold mb-2">{error}</p>
                        <p className="text-sm">
                            Untuk menggunakan fitur laporan penjualan, Anda perlu:
                        </p>
                        <ol className="text-sm list-decimal list-inside mt-1 space-y-1">
                            <li>Membuat tabel <code className="bg-gray-100 px-1 rounded">riwayat_pembelian</code> di Supabase</li>
                            <li>Menjalankan query SQL yang telah disediakan</li>
                            <li>Memastikan tabel memiliki struktur yang benar</li>
                        </ol>
                    </div>
                </AlertBox>
            )}

            {/* Filters */}
            <Card className="mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Periode
                        </label>
                        <RangePicker
                            value={[dayjs(filters.startDate), dayjs(filters.endDate)]}
                            onChange={handleDateRangeChange}
                            format="DD/MM/YYYY"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <Select
                            value={filters.status}
                            onChange={(value) => handleFilterChange('status', value)}
                            placeholder="Semua Status"
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="processing">Processing</Select.Option>
                            <Select.Option value="shipped">Shipped</Select.Option>
                            <Select.Option value="delivered">Delivered</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipe Produk
                        </label>
                        <Select
                            value={filters.produk_tipe}
                            onChange={(value) => handleFilterChange('produk_tipe', value)}
                            placeholder="Semua Produk"
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Select.Option value="obat">Obat</Select.Option>
                            <Select.Option value="alkes">Alat Kesehatan</Select.Option>
                        </Select>
                    </div>
                    <Button
                        type="primary"
                        onClick={loadSalesReport}
                        loading={loading}
                        icon={<BarChartOutlined />}
                    >
                        Refresh Data
                    </Button>
                </div>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={salesStats.totalRevenue || 0}
                            prefix="Rp"
                            valueStyle={{ color: '#3f8600' }}
                            suffix={loading ? <LoadingSpinner size="small" /> : null}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Transaksi"
                            value={salesStats.totalTransactions || 0}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            suffix={loading ? <LoadingSpinner size="small" /> : null}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Produk Terjual"
                            value={salesStats.totalItems || 0}
                            prefix={<LineChartOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                            suffix={loading ? <LoadingSpinner size="small" /> : null}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Rata-rata Order"
                            value={salesStats.averageOrderValue || 0}
                            prefix="Rp"
                            valueStyle={{ color: '#cf1322' }}
                            suffix={loading ? <LoadingSpinner size="small" /> : null}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                {/* Top Products */}
                <div>
                    <Card
                        title="Produk Terlaris"
                        extra={<span className="text-sm text-gray-500">Top 5</span>}
                    >
                        {loading ? (
                            <LoadingSpinner text="Memuat data produk..." />
                        ) : (
                            <Table
                                columns={topProductsColumns}
                                dataSource={topProducts}
                                rowKey="nama"
                                pagination={false}
                                size="small"
                            />
                        )}
                    </Card>
                </div>
                {/* line chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-xl" style={{ minHeight: 400, overflowX: 'auto' }}>
                    <h3 className="text-lg font-semibold mb-4">Tren Penjualan per Bulan</h3>
                    <div className="w-full" style={{ height: 350 }}>
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Penjualan',
                                        data: [120, 190, 300, 250, 400, 320],
                                        borderColor: '#36A2EB',
                                        backgroundColor: 'rgba(54,162,235,0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: true, position: 'top' },
                                    title: { display: false },
                                },
                                scales: {
                                    y: { beginAtZero: true },
                                },
                            }}
                        />
                    </div>
                </div>
                {/* Sales Data Table */}
                <div className="lg:col-span-2">
                    <Card
                        title="Data Penjualan"
                        extra={<span className="text-sm text-gray-500">{salesData.length} transaksi</span>}
                    >
                        {loading ? (
                            <LoadingSpinner text="Memuat data penjualan..." />
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={salesData}
                                rowKey="id"
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} transaksi`
                                }}
                                scroll={{ x: 800 }}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
} 