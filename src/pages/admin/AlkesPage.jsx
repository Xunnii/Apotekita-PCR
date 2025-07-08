import React, { useState, useEffect } from "react";
import { alkesService } from '../../services/alkesService';
import AlertBox from '../../components/Note/AlertBox';
import EmptyState from '../../components/Note/EmptyState';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { Table, Form, Input, InputNumber, Button, Upload, Card } from 'antd';

export default function AlkesPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [alkes, setAlkes] = useState([]);
    const [editingAlkesId, setEditingAlkesId] = useState(null);

    // Fungsi untuk normalisasi fileList dari Upload antd
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Memuat data alkes
    const loadAlkes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await alkesService.getAllAlkes();
            setAlkes(data);
        } catch (err) {
            setError("Gagal memuat data alkes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlkes();
    }, []);

    // Handle form submission untuk membuat atau mengupdate alkes
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            let gambarUrl = null;
            if (values.gambar && values.gambar.length > 0) {
                const fileItem = values.gambar[0];
                if (fileItem.originFileObj) {
                    // User upload gambar baru
                    gambarUrl = await alkesService.uploadGambar(fileItem.originFileObj);
                } else if (fileItem.url) {
                    // User tidak upload gambar baru, pakai gambar lama
                    gambarUrl = fileItem.url;
                }
            }

            const payload = {
                nama_alkes: values.nama_alkes,
                stok_alkes: parseInt(values.stok_alkes),
                harga_alkes: parseFloat(values.harga_alkes),
                gambar: gambarUrl || ""
            };

            if (editingAlkesId) {
                await alkesService.updateAlkes(editingAlkesId, payload);
                setSuccess("Alkes berhasil diperbarui!");
            } else {
                await alkesService.createAlkes(payload);
                setSuccess("Alkes berhasil ditambahkan!");
            }

            setEditingAlkesId(null);
            form.resetFields();
            setTimeout(() => setSuccess(""), 3000);
            loadAlkes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete alkes
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus alkes ini?")) return;
        try {
            setLoading(true);
            setError("");
            await alkesService.deleteAlkes(id);
            setSuccess("Alkes berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            loadAlkes();
        } catch (err) {
            setError("Gagal menghapus alkes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit alkes (mengisi form dengan data alkes yang dipilih)
    const handleEdit = (alkesItem) => {
        setEditingAlkesId(alkesItem.id);
        form.setFieldsValue({
            nama_alkes: alkesItem.nama_alkes,
            stok_alkes: alkesItem.stok_alkes,
            harga_alkes: alkesItem.harga_alkes,
            gambar: alkesItem.gambar
                ? [{
                    uid: '-1',
                    name: alkesItem.gambar.split('/').pop(),
                    status: 'done',
                    url: alkesItem.gambar,
                }]
                : []
        });
    };

    // Kolom tabel
    const columns = [
        { title: '#', dataIndex: 'index', key: 'index', render: (_, __, i) => i + 1 },
        { title: 'Nama Alkes', dataIndex: 'nama_alkes', key: 'nama_alkes' },
        { title: 'Stok', dataIndex: 'stok_alkes', key: 'stok_alkes' },
        { title: 'Harga', dataIndex: 'harga_alkes', key: 'harga_alkes', render: (h) => `Rp ${h.toLocaleString()}` },
        { title: 'Gambar', dataIndex: 'gambar', key: 'gambar', render: (g, row) => g && <img src={g} alt={row.nama_alkes} className="w-16 h-16 object-cover rounded" /> },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex gap-2 items-center">
                    <button onClick={() => handleEdit(row)} disabled={loading} className="p-1 rounded-full hover:bg-blue-100 transition-colors">
                        <AiOutlineEdit className="text-blue-400 text-2xl hover:text-blue-600" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} disabled={loading} className="p-1 rounded-full hover:bg-red-100 transition-colors">
                        <AiFillDelete className="text-red-400 text-2xl hover:text-red-600" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-2">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Manajemen Alat Kesehatan
                </h2>
            </div>
            {/* Alert */}
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            {/* Grid dua kolom: Tabel di atas, form di bawah */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-7">
                {/* Alkes Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit p-6 ">
                    <div className="px-6 py-4  ">
                        <h3 className="text-lg font-semibold">
                            Daftar Alat Kesehatan ({alkes.length})
                        </h3>
                    </div>
                    {loading && <LoadingSpinner text="Memuat data alkes..." />}
                    {!loading && alkes.length === 0 && <EmptyState text="Belum ada data alkes" />}
                    {!loading && alkes.length > 0 && (
                        <Table
                            columns={columns}
                            dataSource={alkes}
                            rowKey="id"
                            pagination={false}
                            size="center"
                        />
                    )}
                </div>
                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingAlkesId ? "Edit Alkes" : "Tambah Alkes Baru"}
                    </h3>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            nama_alkes: '',
                            stok_alkes: '',
                            harga_alkes: '',
                            gambar: []
                        }}
                    >
                        <Form.Item
                            label="Nama Alkes"
                            name="nama_alkes"
                            rules={[{ required: true, message: 'Nama alkes wajib diisi!' }]}
                        >
                            <Input disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Stok"
                            name="stok_alkes"
                            rules={[{ required: true, message: 'Stok wajib diisi!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Harga"
                            name="harga_alkes"
                            rules={[{ required: true, message: 'Harga wajib diisi!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Gambar"
                            name="gambar"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                name="gambar"
                                listType="picture"
                                beforeUpload={() => false} // prevent auto upload
                                maxCount={1}
                                disabled={loading}
                                accept="image/*"
                            >
                                <Button>Upload Gambar</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingAlkesId ? "Perbarui Alkes" : "Tambah Alkes"}
                            </Button>
                            {editingAlkesId && (
                                <Button
                                    style={{ marginLeft: 8 }}
                                    onClick={() => {
                                        setEditingAlkesId(null);
                                        form.resetFields();
                                    }}
                                    disabled={loading}
                                >
                                    Batal Edit
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
} 