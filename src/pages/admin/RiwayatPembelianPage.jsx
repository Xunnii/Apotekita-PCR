import React, { useState, useEffect } from "react";
import AlertBox from '../../components/Note/AlertBox';
import GenericTable from '../../components/Note/GenericTable';
import EmptyState from '../../components/Note/EmptyState';
import LoadingSpinner from '../../components/Note/LoadingSpinner';
import { supabase } from '../../config/supabase';
import { AiFillDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";

export default function RiwayatPembelianPage() {
    const [riwayat, setRiwayat] = useState([]);
    const [pelangganList, setPelangganList] = useState([]);
    const [obatList, setObatList] = useState([]);
    const [alkesList, setAlkesList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [dataForm, setDataForm] = useState({
        pelanggan_id: "",
        produk_tipe: "obat",
        produk_id: "",
        nama_produk: "",
        harga_produk: 0,
        jumlah: 1,
        total_pembelian: 0,
        alamat_tujuan: "",
        metode_pembayaran: "",
        tanggal_transaksi: new Date().toISOString().slice(0, 10)
    });

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

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newForm = { ...dataForm, [name]: value };
        // Jika produk_tipe atau produk_id berubah, update nama_produk & harga_produk
        if (name === 'produk_tipe') {
            newForm.produk_id = "";
            newForm.nama_produk = "";
            newForm.harga_produk = 0;
        }
        if (name === 'produk_id' || name === 'produk_tipe') {
            let produk = null;
            if (newForm.produk_tipe === 'obat') {
                produk = obatList.find(o => o.id === parseInt(newForm.produk_id));
                newForm.nama_produk = produk ? produk.nama_obat : "";
                newForm.harga_produk = produk ? produk.harga_obat : 0;
            } else {
                produk = alkesList.find(a => a.id === parseInt(newForm.produk_id));
                newForm.nama_produk = produk ? produk.nama_alkes : "";
                newForm.harga_produk = produk ? produk.harga_alkes : 0;
            }
        }
        // Update total pembelian
        if (name === 'jumlah' || name === 'produk_id' || name === 'produk_tipe') {
            newForm.total_pembelian = (parseInt(newForm.harga_produk) || 0) * (parseInt(newForm.jumlah) || 0);
        }
        setDataForm(newForm);
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const payload = {
                ...dataForm,
                harga_produk: parseInt(dataForm.harga_produk),
                jumlah: parseInt(dataForm.jumlah),
                total_pembelian: parseInt(dataForm.total_pembelian),
                produk_id: parseInt(dataForm.produk_id),
                pelanggan_id: parseInt(dataForm.pelanggan_id),
                tanggal_transaksi: dataForm.tanggal_transaksi
            };
            if (editingId) {
                const { error } = await supabase.from('riwayat_pembelian').update(payload).eq('id', editingId);
                if (error) throw error;
                setSuccess("Riwayat berhasil diperbarui!");
            } else {
                const { error } = await supabase.from('riwayat_pembelian').insert([payload]);
                if (error) throw error;
                setSuccess("Riwayat berhasil ditambahkan!");
            }
            setShowForm(false);
            setEditingId(null);
            setDataForm({
                pelanggan_id: "",
                produk_tipe: "obat",
                produk_id: "",
                nama_produk: "",
                harga_produk: 0,
                jumlah: 1,
                total_pembelian: 0,
                alamat_tujuan: "",
                metode_pembayaran: "",
                tanggal_transaksi: new Date().toISOString().slice(0, 10)
            });
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
        setDataForm({
            pelanggan_id: item.pelanggan_id,
            produk_tipe: item.produk_tipe,
            produk_id: item.produk_id,
            nama_produk: item.nama_produk,
            harga_produk: item.harga_produk,
            jumlah: item.jumlah,
            total_pembelian: item.total_pembelian,
            alamat_tujuan: item.alamat_tujuan,
            metode_pembayaran: item.metode_pembayaran,
            tanggal_transaksi: item.tanggal_transaksi?.slice(0, 10)
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

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Riwayat Pembelian
                </h2>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg shadow hover:bg-[var(--color-pudar2)]"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setDataForm({ pelanggan_id: "", produk_tipe: "obat", produk_id: "", nama_produk: "", harga_produk: 0, jumlah: 1, total_pembelian: 0, alamat_tujuan: "", metode_pembayaran: "", tanggal_transaksi: new Date().toISOString().slice(0, 10) }); }}
                >
                    <AiOutlinePlus /> {showForm ? "Tutup Form" : "Tambah Riwayat"}
                </button>
            </div>
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <select
                            name="pelanggan_id"
                            value={dataForm.pelanggan_id}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        >
                            <option value="">Pilih Pelanggan</option>
                            {pelangganList.map(p => (
                                <option key={p.id} value={p.id}>{p.nama}</option>
                            ))}
                        </select>
                        <select
                            name="produk_tipe"
                            value={dataForm.produk_tipe}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        >
                            <option value="obat">Obat</option>
                            <option value="alkes">Alat Kesehatan</option>
                        </select>
                        <select
                            name="produk_id"
                            value={dataForm.produk_id}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        >
                            <option value="">Pilih Produk</option>
                            {dataForm.produk_tipe === 'obat' ? (
                                obatList.map(o => (
                                    <option key={o.id} value={o.id}>{o.nama_obat} (Rp {o.harga_obat})</option>
                                ))
                            ) : (
                                alkesList.map(a => (
                                    <option key={a.id} value={a.id}>{a.nama_alkes} (Rp {a.harga_alkes})</option>
                                ))
                            )}
                        </select>
                        <input
                            type="number"
                            name="jumlah"
                            value={dataForm.jumlah}
                            placeholder="Jumlah"
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="alamat_tujuan"
                            value={dataForm.alamat_tujuan}
                            placeholder="Alamat Tujuan"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="metode_pembayaran"
                            value={dataForm.metode_pembayaran}
                            placeholder="Metode Pembayaran"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <input
                            type="date"
                            name="tanggal_transaksi"
                            value={dataForm.tanggal_transaksi}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200"
                            disabled={loading}
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="nama_produk"
                                value={dataForm.nama_produk}
                                placeholder="Nama Produk"
                                readOnly
                                className="w-full p-3 bg-gray-100 rounded-2xl border border-gray-200"
                                disabled
                            />
                            <input
                                type="number"
                                name="harga_produk"
                                value={dataForm.harga_produk}
                                placeholder="Harga Produk"
                                readOnly
                                className="w-full p-3 bg-gray-100 rounded-2xl border border-gray-200"
                                disabled
                            />
                            <input
                                type="number"
                                name="total_pembelian"
                                value={dataForm.total_pembelian}
                                placeholder="Total Pembelian"
                                readOnly
                                className="w-full p-3 bg-gray-100 rounded-2xl border border-gray-200"
                                disabled
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-pudar2)] text-white font-semibold rounded-2xl"
                            disabled={loading}
                        >
                            {loading ? "Mohon Tunggu..." : (editingId ? "Perbarui Riwayat" : "Tambah Riwayat")}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); setShowForm(false); setDataForm({ pelanggan_id: "", produk_tipe: "obat", produk_id: "", nama_produk: "", harga_produk: 0, jumlah: 1, total_pembelian: 0, alamat_tujuan: "", metode_pembayaran: "", tanggal_transaksi: new Date().toISOString().slice(0, 10) }); }}
                                className="ml-4 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-2xl"
                                disabled={loading}
                            >
                                Batal Edit
                            </button>
                        )}
                    </form>
                </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
                <div className="px-6 py-4 ">
                    <h3 className="text-lg font-semibold">
                        Daftar Riwayat Pembelian ({riwayat.length})
                    </h3>
                </div>
                {loading && <LoadingSpinner text="Memuat data riwayat..." />}
                {!loading && riwayat.length === 0 && <EmptyState text="Belum ada riwayat pembelian" />}
                {!loading && riwayat.length > 0 && (
                    <GenericTable
                        columns={["#", "Pelanggan", "Produk", "Tipe", "Harga", "Jumlah", "Total", "Alamat Tujuan", "Metode Pembayaran", "Tanggal", "Aksi"]}
                        data={riwayat}
                        renderRow={(item, index) => (
                            <>
                                <td className="px-6 py-4 font-medium text-gray-700">{index + 1}.</td>
                                <td className="px-6 py-4">{item.pelanggan?.nama || '-'}</td>
                                <td className="px-6 py-4">{item.nama_produk}</td>
                                <td className="px-6 py-4">{item.produk_tipe}</td>
                                <td className="px-6 py-4">Rp {item.harga_produk?.toLocaleString()}</td>
                                <td className="px-6 py-4">{item.jumlah}</td>
                                <td className="px-6 py-4">Rp {item.total_pembelian?.toLocaleString()}</td>
                                <td className="px-6 py-4">{item.alamat_tujuan}</td>
                                <td className="px-6 py-4">{item.metode_pembayaran}</td>
                                <td className="px-6 py-4">{item.tanggal_transaksi?.slice(0, 10)}</td>
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
    );
} 