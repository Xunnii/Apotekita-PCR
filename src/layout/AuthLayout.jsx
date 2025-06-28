import { Outlet, Link, useLocation } from "react-router-dom";

export default function AuthLayout() {
    const location = useLocation();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            {/* Link pojok kanan atas */}
            <div className="absolute top-8 right-12 text-right z-10">
                <div className="text-sm text-gray-700">
                    Already have an acount?{' '}
                    <Link to="/login" className="font-medium underline hover:text-primary">Log in</Link>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    <Link to="/forgot" className="hover:underline">Forgot your user ID or password?</Link>
                </div>
            </div>
            <div className="bg-white p-8 pb-2 rounded-2xl shadow-md w-full max-w-2xl font-Raleway relative flex flex-col items-center">
                {/* Avatar/logo bulat overlap */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center shadow">
                    <img src="/img/LogoAK/AK_kotaknobg.png" alt="Logo" className="w-14 h-14 object-contain rounded-full" />
                </div>
                <div className="mt-1 mb-0 w-full">
                    <Outlet />
                </div>
                <p className="text-center text-sm text-gray-500 mt-16">
                    apotek keluarga registered 2025
                </p>
            </div>
        </div>
    )
}
