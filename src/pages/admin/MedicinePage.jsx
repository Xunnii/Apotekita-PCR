import React, { useState, useEffect } from "react"
import { medicineService } from '../../services/medicineService'
import AlertBox from '../../components/Note/AlertBox'
import GenericTable from '../../components/Note/GenericTable'
import EmptyState from '../../components/Note/EmptyState'
import LoadingSpinner from '../../components/Note/LoadingSpinner'
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai"
import { Table, Form, Input, InputNumber, DatePicker, Button, Upload } from 'antd'
import dayjs from 'dayjs'

export default function MedicinePage() {
    const [form] = Form.useForm()
    const [dataForm, setDataForm] = useState({
        nama_obat: "", stok_obat: "", harga_obat: "", tanggal_kadaluarsa: "", gambar: null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [medicines, setMedicines] = useState([])
    const [editingMedicineId, setEditingMedicineId] = useState(null) // Untuk melacak ID obat yang sedang diedit

    // Fungsi untuk normalisasi fileList dari Upload antd
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Handle perubahan nilai input form
    const handleChange = (evt) => {
        const { name, value, type, files } = evt.target
        setDataForm({
            ...dataForm,
            [name]: type === 'file' ? files[0] : value,
        })
    }

    // Memuat data obat
    const loadMedicines = async () => {
        try {
            setLoading(true)
            setError("")
            const data = await medicineService.getAllMedicines()
            setMedicines(data)
        } catch (err) {
            setError("Gagal memuat data obat")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Load data saat pertama di-render
    useEffect(() => {
        loadMedicines()
    }, [])

    // Handle form submission untuk membuat atau mengupdate obat
    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            setError("")
            setSuccess("")

            let gambarUrl = null
            if (values.gambar && values.gambar.length > 0) {
                const fileItem = values.gambar[0]
                if (fileItem.originFileObj) {
                    // User upload gambar baru
                    gambarUrl = await medicineService.uploadGambar(fileItem.originFileObj)
                } else if (fileItem.url) {
                    // User tidak upload gambar baru, pakai gambar lama
                    gambarUrl = fileItem.url
                }
            }

            const payload = {
                nama_obat: values.nama_obat,
                stok_obat: parseInt(values.stok_obat),
                harga_obat: parseFloat(values.harga_obat),
                tanggal_kadaluarsa: values.tanggal_kadaluarsa ? values.tanggal_kadaluarsa.format('YYYY-MM-DD') : null,
                gambar: gambarUrl || ""
            }

            if (editingMedicineId) {
                await medicineService.updateMedicine(editingMedicineId, payload)
                setSuccess("Obat berhasil diperbarui!")
            } else {
                await medicineService.createMedicine(payload)
                setSuccess("Obat berhasil ditambahkan!")
            }

            // Reset form
            setDataForm({ nama_obat: "", stok_obat: "", harga_obat: "", tanggal_kadaluarsa: "", gambar: null })
            setEditingMedicineId(null)

            // Reset form Ant Design
            form.resetFields()

            setTimeout(() => setSuccess(""), 3000)
            loadMedicines()
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle delete obat
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus obat ini?")) return
        try {
            setLoading(true)
            setError("")
            await medicineService.deleteMedicine(id)
            setSuccess("Obat berhasil dihapus!")
            setTimeout(() => setSuccess(""), 3000)
            loadMedicines()
        } catch (err) {
            setError("Gagal menghapus obat")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle edit obat (mengisi form dengan data obat yang dipilih)
    const handleEdit = (medicine) => {
        setDataForm({
            nama_obat: medicine.nama_obat,
            stok_obat: medicine.stok_obat.toString(),
            harga_obat: medicine.harga_obat.toString(),
            tanggal_kadaluarsa: medicine.tanggal_kadaluarsa,
            gambar: null
        })
        setEditingMedicineId(medicine.id)

        // Set form values untuk Ant Design
        form.setFieldsValue({
            nama_obat: medicine.nama_obat,
            stok_obat: medicine.stok_obat,
            harga_obat: medicine.harga_obat,
            tanggal_kadaluarsa: medicine.tanggal_kadaluarsa ? dayjs(medicine.tanggal_kadaluarsa) : null,
            gambar: medicine.gambar
                ? [{
                    uid: '-1',
                    name: medicine.gambar.split('/').pop(),
                    status: 'done',
                    url: medicine.gambar,
                }]
                : []
        })
    }

    // Ganti bagian render tabel daftar obat
    const columns = [
        { title: '#', dataIndex: 'index', key: 'index', render: (_, __, i) => i + 1 },
        { title: 'Nama Obat', dataIndex: 'nama_obat', key: 'nama_obat' },
        { title: 'Stok', dataIndex: 'stok_obat', key: 'stok_obat' },
        { title: 'Harga', dataIndex: 'harga_obat', key: 'harga_obat', render: (h) => `Rp ${h.toLocaleString()}` },
        { title: 'Tanggal Kadaluarsa', dataIndex: 'tanggal_kadaluarsa', key: 'tanggal_kadaluarsa' },
        { title: 'Gambar', dataIndex: 'gambar', key: 'gambar', render: (g, row) => g && <img src={g} alt={row.nama_obat} className="w-16 h-16 object-cover rounded" /> },
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
                    Manajemen Obat
                </h2>
            </div>
            {/* Alert */}
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-7">
                {/* Medicine Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit p-6 ">
                    <div className="px-6 py-4  ">
                        <h3 className="text-lg font-semibold">
                            Daftar Obat ({medicines.length})
                        </h3>
                    </div>
                    {loading && <LoadingSpinner text="Memuat data obat..." />}
                    {!loading && medicines.length === 0 && <EmptyState text="Belum ada data obat" />}
                    {!loading && medicines.length > 0 && (
                        <Table
                            columns={columns}
                            dataSource={medicines}
                            rowKey="id"
                            pagination={false}
                            size="center"
                        />
                    )}
                </div>
                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingMedicineId ? "Edit Obat" : "Tambah Obat Baru"}
                    </h3>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            nama_obat: dataForm.nama_obat,
                            stok_obat: dataForm.stok_obat,
                            harga_obat: dataForm.harga_obat,
                            tanggal_kadaluarsa: dataForm.tanggal_kadaluarsa ? dayjs(dataForm.tanggal_kadaluarsa) : null,
                            // gambar: dataForm.gambar
                        }}
                    >
                        <Form.Item
                            label="Nama Obat"
                            name="nama_obat"
                            rules={[{ required: true, message: 'Nama obat wajib diisi!' }]}
                        >
                            <Input disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Stok"
                            name="stok_obat"
                            rules={[{ required: true, message: 'Stok wajib diisi!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Harga"
                            name="harga_obat"
                            rules={[{ required: true, message: 'Harga wajib diisi!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            label="Tanggal Kadaluarsa"
                            name="tanggal_kadaluarsa"
                            rules={[{ required: true, message: 'Tanggal kadaluarsa wajib diisi!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} disabled={loading} />
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
                                {editingMedicineId ? "Perbarui Obat" : "Tambah Obat"}
                            </Button>
                            {editingMedicineId && (
                                <Button
                                    style={{ marginLeft: 8 }}
                                    onClick={() => {
                                        setEditingMedicineId(null);
                                        setDataForm({ nama_obat: "", stok_obat: "", harga_obat: "", tanggal_kadaluarsa: "", gambar: null });
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
    )
} 