import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak sama.');
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password berhasil diperbarui.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }

        setLoading(false);
    };

    return (
        <div className="mb-6">
            <h2 className="font-RalewayBold text-2xl font-semibold text-gray-700 mb-2 text-center">
                Reset Password
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">
                Masukkan password baru untuk akun Anda.
            </p>

            {message && (
                <p className="text-sm text-green-600 mb-4 text-center">
                    {message}
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600 mb-4 text-center">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password Baru
                    </label>

                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                        placeholder="Masukkan password baru"
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Konfirmasi Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                        placeholder="Ulangi password baru"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-pudar2 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                >
                    {loading ? 'Memproses...' : 'Ubah Password'}
                </button>
            </form>
        </div>
    );
}