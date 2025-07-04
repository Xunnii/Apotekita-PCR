import React, { useState, useEffect } from "react";
import { alkesService } from '../../services/alkesService';
import AlertBox from '../../components/Note/AlertBox';
import GenericTable from '../../components/Note/GenericTable';
import EmptyState from '../../components/Note/EmptyState';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";

export default function AlkesPage() {
    const [dataForm, setDataForm] = useState({
        nama_alkes: "", stok_alkes: "", harga_alkes: "", gambar: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [alkes, setAlkes] = useState([]);
    const [editingAlkesId, setEditingAlkesId] = useState(null);

    const handleChange = (evt) => {
        const { name, value, type, files } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: type === 'file' ? files[0] : value,
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            let gambarUrl = null;
            if (dataForm.gambar) {
                gambarUrl = await alkesService.uploadGambar(dataForm.gambar);
            }

            const payload = {
                nama_alkes: dataForm.nama_alkes,
                stok_alkes: parseInt(dataForm.stok_alkes),
                harga_alkes: parseFloat(dataForm.harga_alkes),
                gambar: gambarUrl || ""
            };

            if (editingAlkesId) {
                await alkesService.updateAlkes(editingAlkesId, payload);
                setSuccess("Alkes berhasil diperbarui!");
            } else {
                await alkesService.createAlkes(payload);
                setSuccess("Alkes berhasil ditambahkan!");
            }

            setDataForm({ nama_alkes: "", stok_alkes: "", harga_alkes: "", gambar: null });
            setEditingAlkesId(null);
            setTimeout(() => setSuccess(""), 3000);
            loadAlkes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleEdit = (alkesItem) => {
        setDataForm({
            nama_alkes: alkesItem.nama_alkes,
            stok_alkes: alkesItem.stok_alkes.toString(),
            harga_alkes: alkesItem.harga_alkes.toString(),
            gambar: null
        });
        setEditingAlkesId(alkesItem.id);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Manajemen Alat Kesehatan
                </h2>
            </div>
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingAlkesId ? "Edit Alkes" : "Tambah Alkes Baru"}
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nama_alkes"
                            value={dataForm.nama_alkes}
                            placeholder="Nama Alkes"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="number"
                            name="stok_alkes"
                            value={dataForm.stok_alkes}
                            placeholder="Stok"
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="number"
                            name="harga_alkes"
                            value={dataForm.harga_alkes}
                            placeholder="Harga"
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="file"
                            name="gambar"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-pudar2)] text-white font-semibold rounded-2xl"
                            disabled={loading}
                        >
                            {loading ? "Mohon Tunggu..." : (editingAlkesId ? "Perbarui Alkes" : "Tambah Alkes")}
                        </button>
                        {editingAlkesId && (
                            <button
                                type="button"
                                onClick={() => { setEditingAlkesId(null); setDataForm({ nama_alkes: "", stok_alkes: "", harga_alkes: "", gambar: null }); }}
                                className="ml-4 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-2xl"
                                disabled={loading}
                            >
                                Batal Edit
                            </button>
                        )}
                    </form>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
                    <div className="px-6 py-4 ">
                        <h3 className="text-lg font-semibold">
                            Daftar Alat Kesehatan ({alkes.length})
                        </h3>
                    </div>
                    {loading && <LoadingSpinner text="Memuat data alkes..." />}
                    {!loading && alkes.length === 0 && <EmptyState text="Belum ada data alkes" />}
                    {!loading && alkes.length > 0 && (
                        <GenericTable
                            columns={["#", "Nama Alkes", "Stok", "Harga", "Gambar", "Aksi"]}
                            data={alkes}
                            renderRow={(alkesItem, index) => (
                                <>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {index + 1}.
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--color-primary)]">
                                            {alkesItem.nama_alkes}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            {alkesItem.stok_alkes}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            Rp {alkesItem.harga_alkes.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {alkesItem.gambar && (
                                            <img src={alkesItem.gambar} alt={alkesItem.nama_alkes} className="w-16 h-16 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => handleEdit(alkesItem)}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                <AiOutlineEdit className="text-blue-400 text-2xl hover:text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(alkesItem.id)}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                            >
                                                <AiFillDelete className="text-red-400 text-2xl hover:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 