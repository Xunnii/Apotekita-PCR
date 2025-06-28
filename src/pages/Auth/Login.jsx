import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from '../../config/supabase'
import { ImSpinner2 } from "react-icons/im"
import { BsFillExclamationDiamondFill } from "react-icons/bs"

export default function Login() {
    /* navigate, state & handleChange*/
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    })
    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({
            ...dataForm,
            [name]: value,
        })
    }
    /* process form */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Login ke Supabase Auth
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: dataForm.email,
            password: dataForm.password,
        })

        if (loginError) {
            if (loginError.message && loginError.message.toLowerCase().includes('email not confirmed')) {
                setError('Akun Anda belum terverifikasi. Silakan cek email dan klik link verifikasi sebelum login.')
            } else {
                setError(loginError.message)
            }
            setLoading(false)
            return
        }

        setLoading(false)
        navigate("/")
    }
    /* error & loading status */
    const errorInfo = error ? (
        <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
            <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
            {error}
        </div>
    ) : null

    const loadingInfo = loading ? (
        <div className="bg-gray-200 mb-5 p-5 text-sm rounded flex items-center">
            <ImSpinner2 className="me-2 animate-spin" />
            Mohon Tunggu...
        </div>
    ) : null
    return (
        <div>
            {errorInfo}

            {loadingInfo}

            <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Form</h2>
                <p className="text-gray-500 text-sm">Gunakan email dan password akun Anda untuk masuk</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        name="email"
                        type="text"
                        id="email"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                        onChange={handleChange}
                        value={dataForm.email}
                        required
                    />
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Link
                            to="/forgot"
                            className="text-sm text-primary hover:text-pudar2 transition duration-300"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                        value={dataForm.password}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-pudar2 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-2"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="flex justify-between items-center mt-2 text-sm">
                    <span>
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                    </span>
                </div>
            </form>
        </div>
    )
}