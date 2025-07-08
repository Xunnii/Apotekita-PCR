import React, { useState, useEffect } from "react";
import AlertBox from '../../components/Note/AlertBox';
import EmptyState from '../../components/Note/EmptyState';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { supabase } from '../../config/supabase';
import { Form, Input, InputNumber, Select, Button, Table } from 'antd';

export default function PelangganPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pelanggan, setPelanggan] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadPelanggan = async () => {
        try {
            setLoading(true);
            setError("");
            const { data, error } = await supabase
                .from('pelanggan')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            setPelanggan(data);
        } catch (err) {
            setError("Gagal memuat data pelanggan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPelanggan();
    }, []);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('pelanggan')
                    .update(values)
                    .eq('id', editingId);
                if (error) throw error;
                setSuccess("Pelanggan berhasil diperbarui!");
            } else {
                // Insert
                const { error } = await supabase
                    .from('pelanggan')
                    .insert([values]);
                if (error) throw error;
                setSuccess("Pelanggan berhasil ditambahkan!");
            }
            form.resetFields();
            setEditingId(null);
            setShowForm(false);
            setTimeout(() => setSuccess(""), 3000);
            loadPelanggan();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus pelanggan ini?")) return;
        try {
            setLoading(true);
            setError("");
            const { error } = await supabase
                .from('pelanggan')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setSuccess("Pelanggan berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            loadPelanggan();
        } catch (err) {
            setError("Gagal menghapus pelanggan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setShowForm(true);
        form.setFieldsValue({
            nama: item.nama,
            email: item.email,
            alamat: item.alamat,
            phone: item.phone || "",
            segmentasi: item.segmentasi || "silver"
        });
    };

    const columns = [
        { title: '#', dataIndex: 'index', key: 'index', render: (_, __, i) => i + 1 },
        { title: 'Nama', dataIndex: 'nama', key: 'nama' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone', render: (p) => p || '-' },
        { title: 'Alamat', dataIndex: 'alamat', key: 'alamat' },
        { title: 'Segmentasi', dataIndex: 'segmentasi', key: 'segmentasi' },
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Manajemen Pelanggan
                </h2>
            </div>
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                    {!(showForm || editingId) && (
                        <Button type="primary" onClick={() => { setShowForm(true); form.resetFields(); setEditingId(null); }}>
                            Tambah Pelanggan
                        </Button>
                    )}
                    {(showForm || editingId) && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {editingId ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
                            </h3>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{ segmentasi: 'silver' }}
                            >
                                <Form.Item
                                    label="Nama"
                                    name="nama"
                                    rules={[{ required: true, message: 'Nama wajib diisi!' }]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email wajib diisi!' }, { type: 'email', message: 'Email tidak valid!' }]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                                <Form.Item
                                    label="Alamat"
                                    name="alamat"
                                    rules={[{ required: true, message: 'Alamat wajib diisi!' }]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                                <Form.Item
                                    label="Nomor Telepon"
                                    name="phone"
                                    rules={[{ required: true, message: 'Nomor telepon wajib diisi!' }]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                                <Form.Item
                                    label="Segmentasi"
                                    name="segmentasi"
                                >
                                    <Select disabled={loading}>
                                        <Select.Option value="silver">Silver</Select.Option>
                                        <Select.Option value="gold">Gold</Select.Option>
                                        <Select.Option value="platinum">Platinum</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        {editingId ? "Perbarui Pelanggan" : "Tambah Pelanggan"}
                                    </Button>
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        onClick={() => { setShowForm(false); setEditingId(null); form.resetFields(); }}
                                        disabled={loading}
                                    >
                                        Batal
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit p-6">
                    <div className="px-6 py-4 ">
                        <h3 className="text-lg font-semibold">
                            Daftar Pelanggan ({pelanggan.length})
                        </h3>
                    </div>
                    {loading && <LoadingSpinner text="Memuat data pelanggan..." />}
                    {!loading && pelanggan.length === 0 && <EmptyState text="Belum ada data pelanggan" />}
                    {!loading && pelanggan.length > 0 && (
                        <Table
                            columns={columns}
                            dataSource={pelanggan}
                            rowKey="id"
                            pagination={false}
                            size="middle"
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 