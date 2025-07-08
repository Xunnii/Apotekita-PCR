import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, DatePicker, Button, Alert, Table, Typography } from "antd";
import moment from "moment";
import { Bar } from '@ant-design/plots';

const { Title } = Typography;

export default function PrediksiStokPage() {
    const [form] = Form.useForm();
    const [hasil, setHasil] = useState("");
    const [error, setError] = useState("");
    const [prediksi, setPrediksi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [riwayatPrediksi, setRiwayatPrediksi] = useState([]);

    const handleFinish = async (values) => {
        setHasil("");
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(
                "https://cce7e231a547.ngrok-free.app/predict",
                {
                    nama_obat: values.nama_obat,
                    stok: parseInt(values.stok),
                    tgl_kadaluarsa: values.tgl_kadaluarsa.format("YYYY-MM-DD"),
                    tgl_masuk: values.tgl_masuk.format("YYYY-MM-DD"),
                    penjualan: parseInt(values.penjualan),
                    permintaan: parseInt(values.permintaan),
                    tgl_penjualan: values.tgl_penjualan.format("YYYY-MM-DD"),
                }
            );
            setHasil(response.data.status_stok);
            setRiwayatPrediksi(prev => [
                ...prev,
                {
                    id: Date.now(),
                    nama_obat: values.nama_obat,
                    stok: values.stok,
                    permintaan: values.permintaan,
                    penjualan: values.penjualan,
                    status_stok: response.data.status_stok
                }
            ]);
        } catch (err) {
            setError("Gagal memprediksi status stok. Pastikan semua data valid.");
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchPrediksi = async () => {
            try {
                const res = await axios.get(
                    "https://cce7e231a547.ngrok-free.app/prediksi"
                );
                setPrediksi(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setPrediksi([]);
            }
        };
        fetchPrediksi();
    }, []);

    const getSaran = (status) => {
        if (status === "Understock") return "Obat disarankan untuk distok kembali";
        if (status === "Overstock") return "Stok sebaiknya dikurangi atau dihentikan";
        if (status === "Normal") return "Stok dapat dipertahankan";
        return "-";
    };

    // Hitung jumlah status stok dari riwayat prediksi
    const statusCount = riwayatPrediksi.reduce((acc, cur) => {
        acc[cur.status_stok] = (acc[cur.status_stok] || 0) + 1;
        return acc;
    }, {});

    // Data untuk grafik
    const dataChart = [
        { status: 'Normal', jumlah: statusCount['Normal'] || 0 },
        { status: 'Overstock', jumlah: statusCount['Overstock'] || 0 },
        { status: 'Understock', jumlah: statusCount['Understock'] || 0 },
    ];

    const config = {
        data: dataChart,
        xField: 'status',    // Sumbu X = kategori status
        yField: 'jumlah',    // Sumbu Y = nilai jumlah
        color: ({ status }) => {
            if (status === 'Overstock') return '#faad14';
            if (status === 'Understock') return '#f5222d';
            return '#389e0d';
        },
        legend: false,
        height: 300,
        barWidthRatio: 0.5,
        label: {
            position: 'top',
            layout: [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' }
            ]
        },
        xAxis: {
            title: { text: 'Status Stok', style: { fontWeight: 600 } },
        },
        yAxis: {
            title: { text: 'Jumlah', style: { fontWeight: 600 } },
            min: 0
        }
    };


    return (
        <div style={{ background: "#fff", maxWidth: 600, margin: "40px auto", padding: 32, borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2" }}>
            <Title level={2} style={{ textAlign: "center", color: "#389e0d" }}>
                Prediksi Status Stok Obat
            </Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ marginTop: 24 }}
            >
                <Form.Item label="Nama Obat" name="nama_obat" rules={[{ required: true, message: "Masukkan nama obat!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Stok Saat Ini" name="stok" rules={[{ required: true, message: "Masukkan stok!" }]}>
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item label="Tanggal Masuk" name="tgl_masuk" rules={[{ required: true, message: "Pilih tanggal masuk!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Tanggal Kadaluarsa" name="tgl_kadaluarsa" rules={[{ required: true, message: "Pilih tanggal kadaluarsa!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Total Penjualan" name="penjualan" rules={[{ required: true, message: "Masukkan total penjualan!" }]}>
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item label="Permintaan" name="permintaan" rules={[{ required: true, message: "Masukkan permintaan!" }]}>
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item label="Tanggal Penjualan" name="tgl_penjualan" rules={[{ required: true, message: "Pilih tanggal penjualan!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Prediksi Status
                    </Button>
                </Form.Item>
            </Form>

            {hasil && (
                <>
                    <Alert
                        message={`Status Stok: ${hasil}`}
                        type="success"
                        showIcon
                        style={{ marginTop: 16, textAlign: "center" }}
                    />
                    <div style={{ textAlign: "center", marginTop: 8, color: '#389e0d', fontWeight: 500 }}>
                        {getSaran(hasil)}
                    </div>
                </>
            )}
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginTop: 16, textAlign: "center" }}
                />
            )}

            <div style={{ marginTop: 32 }}>
                <Title level={4} style={{ color: "#389e0d" }}>Riwayat Prediksi</Title>
                <Table
                    columns={[
                        { title: "Nama Obat", dataIndex: "nama_obat", key: "nama_obat" },
                        { title: "Stok", dataIndex: "stok", key: "stok" },
                        { title: "Permintaan", dataIndex: "permintaan", key: "permintaan" },
                        { title: "Penjualan", dataIndex: "penjualan", key: "penjualan" },
                        { title: "Status Stok", dataIndex: "status_stok", key: "status_stok" },
                        // { title: "Saran", key: "saran", render: (_, record) => getSaran(record.status_stok) }
                    ]}
                    dataSource={riwayatPrediksi}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: "Tidak ada riwayat prediksi" }}
                />
                <div style={{ marginTop: 40 }}>
                    <Title level={4} style={{ color: "#389e0d" }}>Grafik Jumlah Prediksi per Status</Title>
                    <Bar {...config} />
                </div>
            </div>
        </div>
    );
} 