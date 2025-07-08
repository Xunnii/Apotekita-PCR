import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Popconfirm, message, Space, Avatar } from 'antd';
import { supabase } from '../../config/supabase';

export default function TestimoniAdminPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        // Join ke pelanggan untuk ambil nama dan foto_profil
        const { data, error } = await supabase
            .from('testimoni')
            .select('id, quote, rating, is_approved, pelanggan:pelanggan_id(nama, foto_profil)');
        if (!error && data) setData(data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id) => {
        const { error } = await supabase
            .from('testimoni')
            .update({ is_approved: true })
            .eq('id', id);
        if (!error) {
            message.success('Testimoni di-approve!');
            fetchData();
        } else {
            message.error('Gagal approve testimoni');
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('testimoni')
            .delete()
            .eq('id', id);
        if (!error) {
            message.success('Testimoni dihapus!');
            fetchData();
        } else {
            message.error('Gagal hapus testimoni');
        }
    };

    const columns = [
        {
            title: 'Testimoni',
            dataIndex: 'quote',
            key: 'quote',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <span>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
            )
        },
        {
            title: 'Pelanggan',
            dataIndex: 'pelanggan',
            key: 'pelanggan',
            render: (pelanggan) => (
                <span className="flex items-center gap-2">
                    {pelanggan?.foto_profil ? (
                        <Avatar size={24} src={pelanggan.foto_profil} />
                    ) : (
                        <Avatar size={24} icon={null} />
                    )}
                    {pelanggan?.nama || '-'}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'is_approved',
            key: 'is_approved',
            render: (approved) => (
                <Tag color={approved ? 'green' : 'orange'}>
                    {approved ? 'Approved' : 'Belum'}
                </Tag>
            )
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, record) => (
                <Space>
                    {!record.is_approved && (
                        <Button type="primary" size="small" onClick={() => handleApprove(record.id)}>
                            Approve
                        </Button>
                    )}
                    <Popconfirm title="Hapus testimoni?" onConfirm={() => handleDelete(record.id)} okText="Ya" cancelText="Batal">
                        <Button danger size="small">Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Moderasi Testimoni</h2>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
} 