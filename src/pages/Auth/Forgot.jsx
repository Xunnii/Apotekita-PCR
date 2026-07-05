import { useState } from 'react';
import { supabase } from '../../config/supabase';

export default function Forgot() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');
        setError('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Link reset password telah dikirim ke email.');
        }

        setLoading(false);
    };

    return (
        <div className="mb-6">
            <h2 className="font-RalewayBold text-2xl font-semibold text-gray-700 mb-2 text-center">
                Lupa Password?
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">
                Masukkan email untuk menerima link reset password.
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
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>

                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
                        placeholder="you@example.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-pudar2 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                >
                    {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                </button>
            </form>
        </div>
    );
}