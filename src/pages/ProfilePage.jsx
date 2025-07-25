import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { getPelangganById, updatePelangganProfile, uploadProfilePhoto } from '../services/profileService';
import { Card, Table, Tag, Button, Alert } from 'antd';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ nama: '', phone: '', alamat: '' });
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoError, setPhotoError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                setError('Gagal mengambil data user.');
                setLoading(false);
                return;
            }
            const { data: profileData, error: profileError } = await getPelangganById(data.user.id);
            if (profileError) {
                setError('Gagal mengambil data profile.');
                setLoading(false);
                return;
            }
            setProfile(profileData);
            setForm({
                nama: profileData.nama || '',
                phone: profileData.phone || '',
                alamat: profileData.alamat || ''
            });
            setLoading(false);

            // Load order history
            if (profileData) {
                loadOrderHistory(profileData.id);
            }
        };
        fetchProfile();
    }, []);

    const loadOrderHistory = async (pelangganId) => {
        try {
            setOrdersLoading(true);
            const { data, error } = await supabase
                .from('riwayat_pembelian')
                .select('*')
                .eq('pelanggan_id', pelangganId)
                .order('tanggal_transaksi', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!profile) return;
        const { error: updateError } = await supabase
            .from('pelanggan')
            .update({
                nama: form.nama,
                phone: form.phone,
                alamat: form.alamat
            })
            .eq('id', profile.id);
        if (updateError) {
            setError('Gagal update profile: ' + updateError.message);
            setLoading(false);
            return;
        }
        setSuccess('Profile berhasil diupdate!');
        setLoading(false);
        setProfile({ ...profile, nama: form.nama, phone: form.phone, alamat: form.alamat });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !profile) return;
        setPhotoUploading(true);
        setPhotoError('');
        try {
            const { url, error } = await uploadProfilePhoto(profile.id, file);
            if (error) throw error;
            // Update pelanggan table
            const { error: updateError } = await updatePelangganProfile(profile.id, {
                nama: profile.nama,
                alamat: profile.alamat,
                phone: profile.phone,
                foto_profil: url
            });
            if (updateError) throw updateError;
            setProfile({ ...profile, foto_profil: url });
            setSuccess('Foto profil berhasil diupdate!');
        } catch (err) {
            setPhotoError('Gagal upload foto: ' + (err.message || err.error_description || 'Unknown error'));
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!profile) return;
        setPhotoUploading(true);
        setPhotoError('');
        try {
            const { error: updateError } = await updatePelangganProfile(profile.id, {
                nama: profile.nama,
                alamat: profile.alamat,
                phone: profile.phone,
                foto_profil: null
            });
            if (updateError) throw updateError;
            setProfile({ ...profile, foto_profil: null });
            setSuccess('Foto profil dihapus.');
        } catch (err) {
            setPhotoError('Gagal hapus foto: ' + (err.message || err.error_description || 'Unknown error'));
        } finally {
            setPhotoUploading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'confirmed': return 'blue';
            case 'shipped': return 'purple';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Menunggu Pembayaran';
            case 'confirmed': return 'Dikonfirmasi';
            case 'shipped': return 'Dikirim';
            case 'delivered': return 'Diterima';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    const orderColumns = [
        {
            title: 'Order Number',
            dataIndex: 'order_number',
            key: 'order_number',
            render: (orderNumber) => orderNumber || 'N/A'
        },
        {
            title: 'Produk',
            dataIndex: 'nama_produk',
            key: 'nama_produk'
        },
        {
            title: 'Tipe',
            dataIndex: 'produk_tipe',
            key: 'produk_tipe',
            render: (type) => (
                <Tag color={type === 'obat' ? 'blue' : 'green'}>
                    {type === 'obat' ? 'Obat' : 'Alkes'}
                </Tag>
            )
        },
        {
            title: 'Jumlah',
            dataIndex: 'jumlah',
            key: 'jumlah'
        },
        {
            title: 'Total',
            dataIndex: 'total_pembelian',
            key: 'total_pembelian',
            render: (amount) => `Rp ${amount?.toLocaleString()}`
        },
        {
            title: 'Status',
            dataIndex: 'status_order',
            key: 'status_order',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: 'Tanggal',
            dataIndex: 'tanggal_transaksi',
            key: 'tanggal_transaksi',
            render: (date) => new Date(date).toLocaleDateString('id-ID')
        }
    ];

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            {/* Profile Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
                {/* Foto Profil */}
                <div className="flex flex-col items-center mb-4">
                    {profile.foto_profil ? (
                        <img
                            src={profile.foto_profil}
                            alt="Foto Profil"
                            className="w-24 h-24 rounded-full object-cover border mb-2"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-gray-400">
                            <span className="text-4xl">👤</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <label className="bg-primary text-white px-3 py-1 rounded cursor-pointer text-sm hover:bg-pudar2">
                            {photoUploading ? 'Uploading...' : 'Ganti Foto'}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                                disabled={photoUploading}
                            />
                        </label>
                        {profile.foto_profil && (
                            <button
                                type="button"
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                style={{ color: 'white' }}
                                onClick={handleRemovePhoto}
                                disabled={photoUploading}
                            >
                                Hapus Foto
                            </button>
                        )}
                    </div>
                    {photoError && <div className="text-red-600 text-xs mt-1">{photoError}</div>}
                </div>
                <div className="mb-4">
                    <div className="text-gray-600 text-sm mb-1">Email</div>
                    <div className="font-semibold">{profile.email}</div>
                    <Alert
                        message={`Segmentasi: ${profile.segmentasi?.charAt(0).toUpperCase() + profile.segmentasi?.slice(1)}`}
                        type={
                            profile.segmentasi === 'platinum'
                                ? 'success'
                                : profile.segmentasi === 'gold'
                                    ? 'warning'
                                    : 'info'
                        }
                        showIcon
                        style={{ marginTop: 12, marginBottom: 12 }}
                    />
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="nama"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={form.nama}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <textarea
                            name="alamat"
                            rows="3"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={form.alamat}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-pudar2 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-2"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                    {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                </form>
                <a
                    href="https://apotek-teal.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    Kunjungi Apotek Online
                </a>
            </div>
        </div>
    );
} 