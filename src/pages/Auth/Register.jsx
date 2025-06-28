import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', phone: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-4">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create an account</h2>
                <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis maximus</p>
            </div>
            <form>
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
                    />
                </div>
                {/* Phone */}
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">We strongly recommend adding a phone number. This will help verify your account and keep it safe.</p>
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
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-2"
                >
                    Sign in
                </button>
            </form>
            <div className="flex justify-between items-center mt-2 text-sm">
                <span>
                    Already have an acount?{' '}
                    <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </span>
                <Link to="/forgot" className="text-gray-400 hover:underline">Forgot your user ID or password?</Link>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
                By creating an account, you agree to the <span className="underline cursor-pointer">Terms of use</span> and <span className="underline cursor-pointer">Privacy Policy.</span>
            </p>
        </div>
    );
}
