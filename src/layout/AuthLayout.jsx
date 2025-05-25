import { Outlet } from "react-router-dom";
import Logo from '../assets/Logo.png'

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md font-Raleway">
                <div className="flex items-center justify-center mb-6">
                    <img src={Logo} alt="" />
                </div>

                <Outlet />

                <p className="text-center text-sm text-gray-500 mt-6">
                    anak yayasan @kimiafarma --ApotekKita
                </p>
            </div>
        </div>
    )
}
