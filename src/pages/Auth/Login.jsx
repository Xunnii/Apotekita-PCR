import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
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
        setError(false)
        console.log("Login data:", dataForm);

        axios
            .post("https://dummyjson.com/user/login", {
                username: dataForm.email,
                password: dataForm.password,
            })
            .then((response) => {
                // Jika status bukan 200, tampilkan pesan error
                if (response.status !== 200) {
                    setError(response.data.message);
                    return;
                }

                // Redirect ke dashboard jika login sukses
                navigate("/");
            })
            .catch((err) => {
                if (err.response) {
                    setError(err.response.data.message || "An error occurred");
                } else {
                    setError(err.message || "An unknown error occurred");
                }
            })
            .finally(() => {
                setLoading(false);
            });

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
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Kamu
                    </label>
                    <input
                        name="email"
                        type="text"
                        id="email"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="Name"
                        onChange={handleChange}

                    />
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Link
                            to="/forgot"
                            className="text-sm text-primary hover:text-primaryHover transition duration-300"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <input

                        type="password"
                        id="password"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"

                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primaryHover text-white font-semibold py-2 px-4
                        rounded-lg transition duration-300"
                >
                    Login
                </button>
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">Don't have an account? </span>
                    <Link
                        to="/register"
                        className="text-sm font-medium text-primaryHover hover:text-primary transition duration-300"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    )
}