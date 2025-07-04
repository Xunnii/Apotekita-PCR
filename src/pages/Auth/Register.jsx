import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { supabase } from '../../config/supabase';
import { insertPelanggan } from '../../services/profileService';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', nama: '', alamat: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        // 1. Register ke Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });
        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }
        // 2. Insert ke tabel pelanggan
        const user = data.user || data;
        const { error: pelangganError } = await insertPelanggan({
            id: user.id,
            email: form.email,
            nama: form.nama,
            alamat: form.alamat,
            phone: form.phone,
        });
        if (pelangganError) {
            setError(pelangganError.message);
            setLoading(false);
            return;
        }
        setSuccess('Registrasi berhasil! Silakan cek email untuk verifikasi atau login.');
        setLoading(false);
        setForm({ email: '', password: '', nama: '', alamat: '', phone: '' });
    };

    return (
        <div className="mt-4 mb-10">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Registrasi Form</h2>
                <p className="text-gray-500 text-sm">Gunakan email anda, dan password yang sesuai</p>
            </div>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-sm">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-2 mb-3 rounded text-sm">{success}</div>}
            <form onSubmit={handleRegister}>
                {/* Nama */}
                <div className="mb-4">
                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        id="nama"
                        name="nama"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nama Lengkap"
                        value={form.nama}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Email */}
                <div className="mb-4 relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Phone */}
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="08123456789"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Alamat */}
                <div className="mb-4">
                    <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    <input
                        type="text"
                        id="alamat"
                        name="alamat"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Alamat Lengkap"
                        value={form.alamat}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Password */}
                <div className="mb-2 relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                            placeholder="********"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                    <span className="absolute right-0 top-0 text-xs text-gray-400 select-none cursor-default">{showPassword ? 'Hide' : 'Show'}</span>
                </div>
                {/* Password Tips */}
                <div className="mb-6 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-400">
                    <div className="flex items-center gap-1"><span>●</span> Use 8 or more characters</div>
                    <div className="flex items-center gap-1"><span>●</span> Use upper and lower case letters (e.g. Aa)</div>
                    <div className="flex items-center gap-1"><span>●</span> Use a number (e.g. 1234)</div>
                    <div className="flex items-center gap-1"><span>●</span> Use a symbol (e.g. !@#$)</div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-pudar2 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-2"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <div className="flex justify-between items-center mt-2 text-sm">
                <span>
                    Already have an acount?{' '}
                    <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </span>
                <Link to="/forgot" className="text-gray-400 hover:underline">Forgot your user ID or password?</Link>
            </div>
        </div>
    );
}
