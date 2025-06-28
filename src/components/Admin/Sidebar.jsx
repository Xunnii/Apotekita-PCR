import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    HomeIcon,
    PencilIcon,
    Square2StackIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarToggle, setSidebarToggle }) => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('Dashboard');

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <HomeIcon className="h-6 w-6" />,
            path: '/admin/dashboard'
        },
        {
            title: 'Notes',
            icon: <PencilIcon className="h-6 w-6" />,
            path: '/admin/notes'
        },
        {
            title: 'Blank',
            icon: <Square2StackIcon className="h-6 w-6" />,
            path: '/admin/blank'
        },
        {
            title: 'Medicine',
            icon: <Square2StackIcon className="h-6 w-6" />,
            path: '/admin/medicine'
        },
        {
            title: 'Konsultasi',
            icon: <Square2StackIcon className="h-6 w-6" />,
            path: '/admin/konsultasi-dokter'
        },
    ];

    const handleMenuClick = (title) => {
        setActiveMenu(activeMenu === title ? '' : title);
    };

    const isMenuItemActive = (item) => {
        if (item.submenu) {
            return item.submenu.some(subItem => location.pathname === subItem.path);
        }
        return location.pathname === item.path;
    };

    return (
        <aside
            className={`fixed left-0 top-0 z-50 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out
                ${sidebarToggle ? 'w-72.5 translate-x-0' : 'w-[90px] -translate-x-full'}
                lg:translate-x-0 ${sidebarToggle ? 'lg:w-72.5' : 'lg:w-[90px]'}`}
        >
            {/* Sidebar Header */}
            <div
                className={`flex items-center gap-2 pt-8 sidebar-header pb-7 ${sidebarToggle ? 'justify-between px-4' : 'justify-center'}`}
            >
                <Link to="/admin/dashboard">
                    <span className={`logo ${sidebarToggle ? '' : 'lg:hidden'}`}>
                        <h1 className="text-2xl font-bold text-gray-900">Apotekita</h1>
                    </span>
                    <img
                        className={`logo-icon ${sidebarToggle ? 'hidden' : 'lg:block'}`}
                        src="/path/to/logo-icon.svg"
                        alt="Logo"
                    />
                </Link>

                {/* Close sidebar button for mobile */}
                <button
                    className="block lg:hidden"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSidebarToggle(!sidebarToggle);
                    }}
                >
                    <svg
                        className="fill-current text-gray-500 hover:text-gray-700"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                        />
                    </svg>
                </button>
            </div>

            {/* Sidebar Menu */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear px-2">
                <nav className="mt-5 py-4">
                    <ul className="mb-6 flex flex-col gap-2">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    onClick={() => handleMenuClick(item.title)}
                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray-100
                                        ${location.pathname === item.path || isMenuItemActive(item)
                                            ? 'bg-primary text-white hover:bg-primary/90'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon.type
                                        {...item.icon.props}
                                        className={`${item.icon.props.className} ${activeMenu === item.title || isMenuItemActive(item)
                                            ? 'menu-item-icon-active'
                                            : 'menu-item-icon-inactive'
                                            } ${!sidebarToggle ? 'lg:h-8 lg:w-8' : ''}`}
                                    />
                                    <span className={`menu-item-text ${sidebarToggle ? '' : 'lg:hidden'}`}>
                                        {item.title}
                                    </span>
                                    {location.pathname === item.path && (
                                        <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary"></span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
