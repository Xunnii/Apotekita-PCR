import React, { useEffect, useState } from 'react';
import { Table, Image, Modal, Spin, Alert } from 'antd';
import { getAllObatResep } from '../../services/obatResepService';

const SUPABASE_URL = 'https://rlkrzkngbfbzumeipfbs.supabase.co/storage/v1/object/public/resep/';

export default function ObatResepAdminPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState({ visible: false, url: '' });

    useEffect(() => {
        async function fetchData() {
            try {
                const resep = await getAllObatResep();
                setData(resep);
            } catch (err) {
                setError('Gagal memuat data resep');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Keterangan',
            dataIndex: 'keterangan',
            key: 'keterangan',
            width: 250,
        },
        {
            title: 'Gambar',
            dataIndex: 'gambar',
            key: 'gambar',
            width: 120,
            render: (url) => url ? (
                <Image
                    width={60}
                    src={SUPABASE_URL + url}
                    style={{ cursor: 'pointer' }}
                    preview={false}
                    onClick={() => setPreview({ visible: true, url: SUPABASE_URL + url })}
                />
            ) : '-',
        },
        {
            title: 'Tanggal Kirim',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: (val) => val ? new Date(val).toLocaleString() : '-',
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 24 }}>Daftar Resep Obat Masuk</h2>
            {loading ? <Spin /> : error ? <Alert type="error" message={error} /> : (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
            <Modal
                open={preview.visible}
                footer={null}
                onCancel={() => setPreview({ visible: false, url: '' })}
                width={600}
            >
                <img alt="Resep Obat" src={preview.url} style={{ width: '100%' }} />
            </Modal>
        </div>
    );
} 