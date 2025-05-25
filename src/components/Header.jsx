import { NavLink } from "react-router-dom";



export default function Navbar() {
    // Fungsi untuk menentukan kelas CSS berdasarkan apakah link aktif
    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2
    ${isActive ?
            "text-white bg-primaryHover font-bold" :
            "text-gray-600 hover:text-white hover:bg-primaryHover hover:font-extrabold"
        }`;

    return (
        <div className="bg-white shadow-md">
            <div className="font-Raleway  flex justify-between items-center px-10 py-4">

                {/* Logo */}
                <div className="w-20 h-10 flex items-center">
                    <a className="text-3xl font-bold leading-none" href="#">
                        <img src="img/Logo.png" alt="Logo" className="h-12 w-auto" />
                    </a>
                </div>

                {/* Menu Items */}
                <div id="navbar-menu" className="hidden lg:flex space-x-6">
                    <NavLink to="/" className={menuClass}>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/apoteker" className={menuClass}>
                        <span>Apoteker</span>
                    </NavLink>

                    <NavLink to="/cek-mata" className={menuClass}>
                        <span>Cek Mata</span>
                    </NavLink>

                    <NavLink to="/daftar-obat" className={menuClass}>
                        <span>Daftar Obat</span>
                    </NavLink>

                    <NavLink to="/konsultasi-dokter" className={menuClass}>
                        <span>Konsultasi Dokter</span>
                    </NavLink>
                </div>

                {/* Authentication Buttons */}
                <div className="hidden lg:flex items-center space-x-4">
                    <NavLink to="/login" className="text-sm text-gray-600 hover:text-hijau">
                        Sign In
                    </NavLink>
                    <NavLink to="/register" className="py-2 px-4 bg-primaryHover hover:bg-blue-600 text-white rounded-xl text-sm">
                        Sign Up
                    </NavLink>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="lg:hidden">
                    <button className="navbar-burger flex items-center p-3 text-blue-600">
                        <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <title>Mobile menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
