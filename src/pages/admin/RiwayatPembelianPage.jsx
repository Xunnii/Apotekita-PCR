import React, { useState, useEffect } from "react";
import AlertBox from '../../components/Note/AlertBox';
import EmptyState from '../../components/Note/EmptyState';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { supabase } from '../../config/supabase';
import { AiFillDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { Form, Input, InputNumber, Select, Button, DatePicker, Table } from 'antd';
import dayjs from 'dayjs';

export default function RiwayatPembelianPage() {
    const [form] = Form.useForm();
    const [riwayat, setRiwayat] = useState([]);
    const [pelangganList, setPelangganList] = useState([]);
    const [obatList, setObatList] = useState([]);
    const [alkesList, setAlkesList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);

    // Load data dropdown
    useEffect(() => {
        (async () => {
            const { data: pelanggan } = await supabase.from('pelanggan').select('id, nama');
            setPelangganList(pelanggan || []);
            const { data: obat } = await supabase.from('daftar_obat').select('id, nama_obat, harga_obat');
            setObatList(obat || []);
            const { data: alkes } = await supabase.from('alat_kesehatan').select('id, nama_alkes, harga_alkes');
            setAlkesList(alkes || []);
        })();
    }, []);

    // Load riwayat pembelian
    const loadRiwayat = async () => {
        try {
            setLoading(true);
            setError("");
            const { data, error } = await supabase
                .from('riwayat_pembelian')
                .select('*, pelanggan(nama)')
                .order('tanggal_transaksi', { ascending: false });
            if (error) throw error;
            setRiwayat(data);
        } catch (err) {
            setError("Gagal memuat data riwayat pembelian");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { loadRiwayat(); }, []);

    // Handle form change (produk_id, produk_tipe, jumlah)
    const handleFormChange = (changed, all) => {
        let newValues = { ...all, ...changed };
        // Update nama_produk & harga_produk
        if (changed.produk_tipe) {
            newValues.produk_id = undefined;
            newValues.nama_produk = '';
            newValues.harga_produk = 0;
        }
        if (changed.produk_id || changed.produk_tipe) {
            let produk = null;
            if (newValues.produk_tipe === 'obat') {
                produk = obatList.find(o => o.id === newValues.produk_id);
                newValues.nama_produk = produk ? produk.nama_obat : '';
                newValues.harga_produk = produk ? produk.harga_obat : 0;
            } else {
                produk = alkesList.find(a => a.id === newValues.produk_id);
                newValues.nama_produk = produk ? produk.nama_alkes : '';
                newValues.harga_produk = produk ? produk.harga_alkes : 0;
            }
        }
        // Update total pembelian
        if (changed.jumlah || changed.produk_id || changed.produk_tipe) {
            newValues.total_pembelian = (parseInt(newValues.harga_produk) || 0) * (parseInt(newValues.jumlah) || 0);
        }
        form.setFieldsValue(newValues);
    };

    // Handle submit
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            if (!values.pelanggan_id) {
                setError("Pelanggan wajib dipilih!");
                setLoading(false);
                return;
            }
            const payload = {
                ...values,
                tanggal_transaksi: values.tanggal_transaksi ? values.tanggal_transaksi.format('YYYY-MM-DD') : undefined
            };
            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('riwayat_pembelian')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
                setSuccess("Riwayat berhasil diperbarui!");
            } else {
                // Insert
                const { error } = await supabase
                    .from('riwayat_pembelian')
                    .insert([payload]);
                if (error) throw error;
                setSuccess("Riwayat berhasil ditambahkan!");
            }
            setShowForm(false);
            setEditingId(null);
            form.resetFields();
            setTimeout(() => setSuccess(""), 3000);
            loadRiwayat();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit
    const handleEdit = (item) => {
        setShowForm(true);
        setEditingId(item.id);
        form.setFieldsValue({
            pelanggan_id: item.pelanggan_id,
            produk_tipe: item.produk_tipe,
            produk_id: item.produk_id,
            nama_produk: item.nama_produk,
            harga_produk: item.harga_produk,
            jumlah: item.jumlah,
            total_pembelian: item.total_pembelian,
            alamat_tujuan: item.alamat_tujuan,
            metode_pembayaran: item.metode_pembayaran,
            status_order: item.status_order || 'pending',
            tanggal_transaksi: item.tanggal_transaksi ? dayjs(item.tanggal_transaksi) : dayjs()
        });
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus riwayat ini?")) return;
        try {
            setLoading(true);
            setError("");
            const { error } = await supabase.from('riwayat_pembelian').delete().eq('id', id);
            if (error) throw error;
            setSuccess("Riwayat berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            loadRiwayat();
        } catch (err) {
            setError("Gagal menghapus riwayat");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: '#', dataIndex: 'index', key: 'index', render: (_, __, i) => i + 1 },
        { title: 'Pelanggan', dataIndex: ['pelanggan', 'nama'], key: 'pelanggan', render: (v, row) => row.pelanggan?.nama || '-' },
        { title: 'Produk', dataIndex: 'nama_produk', key: 'nama_produk' },
        { title: 'Tipe', dataIndex: 'produk_tipe', key: 'produk_tipe' },
        { title: 'Harga', dataIndex: 'harga_produk', key: 'harga_produk', render: (h) => `Rp ${h?.toLocaleString()}` },
        { title: 'Jumlah', dataIndex: 'jumlah', key: 'jumlah' },
        { title: 'Total', dataIndex: 'total_pembelian', key: 'total_pembelian', render: (t) => `Rp ${t?.toLocaleString()}` },
        { title: 'Alamat', dataIndex: 'alamat_tujuan', key: 'alamat_tujuan' },
        {
            title: 'Status', dataIndex: 'status_order', key: 'status_order', render: (s) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                ${s === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        s === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            s === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                s === 'delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'}`}>{s || 'pending'}</span>
            )
        },
        { title: 'Tanggal', dataIndex: 'tanggal_transaksi', key: 'tanggal_transaksi', render: (t) => t?.slice(0, 10) },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => handleEdit(row)}
                        disabled={loading}
                        className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                        <AiOutlineEdit className="text-blue-400 text-2xl hover:text-blue-600" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        disabled={loading}
                        className="p-1 rounded-full hover:bg-red-100 transition-colors"
                    >
                        <AiFillDelete className="text-red-400 text-2xl hover:text-red-600" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Riwayat Pembelian
                </h2>
                <Button
                    type="primary"
                    icon={<AiOutlinePlus />}
                    onClick={() => { setShowForm(!showForm); setEditingId(null); form.resetFields(); }}
                >
                    {showForm ? "Tutup Form" : "Tambah Riwayat"}
                </Button>
            </div>
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ produk_tipe: 'obat', jumlah: 1, status_order: 'pending', tanggal_transaksi: dayjs() }}
                        onValuesChange={handleFormChange}
                    >
                        <Form.Item
                            label="Pelanggan"
                            name="pelanggan_id"
                            rules={[{ required: true, message: 'Pelanggan wajib dipilih!' }]}
                        >
                            <Select placeholder="Pilih Pelanggan" disabled={loading} showSearch optionFilterProp="children">
                                {pelangganList.map(p => (
                                    <Select.Option key={p.id} value={p.id}>{p.nama}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Tipe Produk"
                            name="produk_tipe"
                            rules={[{ required: true, message: 'Tipe produk wajib dipilih!' }]}
                        >
                            <Select disabled={loading}>
                                <Select.Option value="obat">Obat</Select.Option>
                                <Select.Option value="alkes">Alat Kesehatan</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Produk"
                            name="produk_id"
                            rules={[{ required: true, message: 'Produk wajib dipilih!' }]}
                        >
                            <Select placeholder="Pilih Produk" disabled={loading} showSearch optionFilterProp="children">
                                {form.getFieldValue('produk_tipe') === 'obat' ? (
                                    obatList.map(o => (
                                        <Select.Option key={o.id} value={o.id}>{o.nama_obat} (Rp {o.harga_obat})</Select.Option>
                                    ))
                                ) : (
                                    alkesList.map(a => (
                                        <Select.Option key={a.id} value={a.id}>{a.nama_alkes} (Rp {a.harga_alkes})</Select.Option>
                                    ))
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Jumlah"
                            name="jumlah"
                            rules={[{ required: true, message: 'Jumlah wajib diisi!' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Alamat Tujuan"
                            name="alamat_tujuan"
                            rules={[{ required: true, message: 'Alamat tujuan wajib diisi!' }]}
                        >
                            <Input disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Metode Pembayaran"
                            name="metode_pembayaran"
                            rules={[{ required: true, message: 'Metode pembayaran wajib diisi!' }]}
                        >
                            <Input disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Status"
                            name="status_order"
                        >
                            <Select disabled={loading}>
                                <Select.Option value="pending">Pending</Select.Option>
                                <Select.Option value="confirmed">Confirmed</Select.Option>
                                <Select.Option value="shipped">Shipped</Select.Option>
                                <Select.Option value="delivered">Delivered</Select.Option>
                                <Select.Option value="cancelled">Cancelled</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Tanggal Transaksi"
                            name="tanggal_transaksi"
                            rules={[{ required: true, message: 'Tanggal transaksi wajib diisi!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} disabled={loading} />
                        </Form.Item>
                        <Form.Item label="Nama Produk" name="nama_produk">
                            <Input disabled readOnly />
                        </Form.Item>
                        <Form.Item label="Harga Produk" name="harga_produk">
                            <InputNumber style={{ width: '100%' }} disabled readOnly />
                        </Form.Item>
                        <Form.Item label="Total Pembelian" name="total_pembelian">
                            <InputNumber style={{ width: '100%' }} disabled readOnly />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingId ? "Perbarui Riwayat" : "Tambah Riwayat"}
                            </Button>
                            <Button
                                style={{ marginLeft: 8 }}
                                onClick={() => { setEditingId(null); setShowForm(false); form.resetFields(); }}
                                disabled={loading}
                            >
                                Batal
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto w-full h-fit p-6">
                <div className="px-6 py-4 ">
                    <h3 className="text-lg font-semibold">
                        Daftar Riwayat Pembelian ({riwayat.length})
                    </h3>
                </div>
                {loading && <LoadingSpinner text="Memuat data riwayat..." />}
                {!loading && riwayat.length === 0 && <EmptyState text="Belum ada riwayat pembelian" />}
                {!loading && riwayat.length > 0 && (
                    <Table
                        columns={columns}
                        dataSource={riwayat}
                        rowKey="id"
                        size="middle"
                        scroll={{ x: 'max-content' }}
                        style={{ width: '100%' }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: [5, 10, 20, 50],
                            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data`
                        }}
                    />
                )}
            </div>
        </div>
    );
} 