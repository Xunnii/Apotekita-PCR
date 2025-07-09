import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Table, Tag, Button } from 'antd';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError('');
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                setError('Gagal mengambil data user.');
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('riwayat_pembelian')
                .select('*')
                .eq('pelanggan_id', userData.user.id)
                .order('tanggal_transaksi', { ascending: false });
            if (error) {
                setError('Gagal mengambil data riwayat pembelian.');
                setLoading(false);
                return;
            }
            setOrders(data || []);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'confirmed': return 'blue';
            case 'shipped': return 'purple';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Menunggu Pembayaran';
            case 'confirmed': return 'Dikonfirmasi';
            case 'shipped': return 'Dikirim';
            case 'delivered': return 'Diterima';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    const columns = [

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
            title: 'Status',
            dataIndex: 'status_order',
            key: 'status_order',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: 'Tanggal',
            dataIndex: 'tanggal_transaksi',
            key: 'tanggal_transaksi',
            render: (date) => new Date(date).toLocaleDateString('id-ID')
        }
    ];

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 mb-9">
            <div className="bg-white rounded-xl shadow p-8">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Riwayat Pesanan Saya</h2>
                {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg mb-4">Belum ada pesanan</p>
                        <Button type="primary" onClick={() => window.location.href = '/daftar-obat'}>
                            Mulai Belanja
                        </Button>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        size="small"
                    />
                )}
            </div>
        </div>
    );
} 