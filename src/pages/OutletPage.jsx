import React, { useEffect, useState } from 'react';
import { Card, List, Spin, Alert } from 'antd';

export default function OutletPage() {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/data/outlet.json')
            .then(res => res.json())
            .then(setOutlets)
            .catch(() => setError('Gagal memuat data outlet'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: 16 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Daftar Outlet Apotek Keluarga</h2>
            {loading ? <Spin /> : error ? <Alert type="error" message={error} /> : (
                <List
                    dataSource={outlets}
                    renderItem={outlet => (
                        <Card key={outlet.id} title={outlet.nama_outlet} style={{ marginBottom: 16 }}>
                            <div><b>Alamat:</b> {outlet.alamat}</div>
                            <div><b>Kota:</b> {outlet.kota}</div>
                            <div><b>Telepon:</b> {outlet.telepon}</div>
                            <div><b>Jam Buka:</b> {outlet.jam_buka}</div>
                            {outlet.embed_map_url && (
                                <iframe
                                    src={outlet.embed_map_url}
                                    width="100%"
                                    height="250"
                                    style={{ border: 0, marginTop: 12 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Peta ${outlet.nama_outlet}`}
                                />
                            )}
                        </Card>
                    )}
                />
            )}
        </div>
    );
} 