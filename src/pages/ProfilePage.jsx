import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { getPelangganById } from '../services/profileService';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ nama: '', phone: '', alamat: '' });

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
        };
        fetchProfile();
    }, []);

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

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
            <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Email</div>
                <div className="font-semibold">{profile.email}</div>
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
        </div>
    );
} 