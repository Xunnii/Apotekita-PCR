import React, { useState, useEffect } from "react";
import AlertBox from '../../components/Note/AlertBox';
import GenericTable from '../../components/Note/GenericTable';
import EmptyState from '../../components/Note/EmptyState';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { supabase } from '../../config/supabase';

export default function PelangganPage() {
    const [dataForm, setDataForm] = useState({
        nama: "", email: "", alamat: "", phone: "", segmentasi: "silver"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pelanggan, setPelanggan] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('pelanggan')
                    .update(dataForm)
                    .eq('id', editingId);
                if (error) throw error;
                setSuccess("Pelanggan berhasil diperbarui!");
            } else {
                // Insert
                const { error } = await supabase
                    .from('pelanggan')
                    .insert([dataForm]);
                if (error) throw error;
                setSuccess("Pelanggan berhasil ditambahkan!");
            }
            setDataForm({ nama: "", email: "", alamat: "", phone: "", segmentasi: "silver" });
            setEditingId(null);
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
        setDataForm({
            nama: item.nama,
            email: item.email,
            alamat: item.alamat,
            phone: item.phone || "",
            segmentasi: item.segmentasi || "silver"
        });
        setEditingId(item.id);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Manajemen Pelanggan
                </h2>
            </div>
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingId ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nama"
                            value={dataForm.nama}
                            placeholder="Nama"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="email"
                            name="email"
                            value={dataForm.email}
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="alamat"
                            value={dataForm.alamat}
                            placeholder="Alamat"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={dataForm.phone}
                            placeholder="Nomor Telepon"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <select
                            name="segmentasi"
                            value={dataForm.segmentasi}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        >
                            <option value="silver">Silver</option>
                            <option value="gold">Gold</option>
                            <option value="platinum">Platinum</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-pudar2)] text-white font-semibold rounded-2xl"
                            disabled={loading}
                        >
                            {loading ? "Mohon Tunggu..." : (editingId ? "Perbarui Pelanggan" : "Tambah Pelanggan")}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); setDataForm({ nama: "", email: "", alamat: "", phone: "", segmentasi: "silver" }); }}
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
                            Daftar Pelanggan ({pelanggan.length})
                        </h3>
                    </div>
                    {loading && <LoadingSpinner text="Memuat data pelanggan..." />}
                    {!loading && pelanggan.length === 0 && <EmptyState text="Belum ada data pelanggan" />}
                    {!loading && pelanggan.length > 0 && (
                        <GenericTable
                            columns={["#", "Nama", "Email", "Phone", "Alamat", "Segmentasi", "Aksi"]}
                            data={pelanggan}
                            renderRow={(item, index) => (
                                <>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {index + 1}.
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--color-primary)]">
                                            {item.nama}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            {item.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            {item.phone || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            {item.alamat}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">
                                            {item.segmentasi}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                <AiOutlineEdit className="text-blue-400 text-2xl hover:text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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