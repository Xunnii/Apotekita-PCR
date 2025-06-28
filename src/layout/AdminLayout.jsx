import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Header from '../components/Admin/Header';
import Overlay from '../components/Admin/Overlay';
import Breadcrumb from '../components/Admin/Breadcrumb';

export default function AdminLayout() {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(true); // default open
    const location = useLocation();

    // Get page name from path
    const getPageName = () => {
        const path = location.pathname.split('/').pop();
        if (location.pathname === '/admin') {
            return 'Dashboard';
        }
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    useEffect(() => {
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
        if (savedDarkMode !== null) {
            setDarkMode(savedDarkMode);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <div className={`flex h-screen w-full overflow-hidden ${darkMode ? 'dark bg-gray-900' : ''}`}>
            {/* Sidebar */}
            <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

            {/* Main Content */}
            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Overlay for mobile */}
                <Overlay sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

                {/* Header */}
                <div
                    className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 
                        ${sidebarToggle ? 'pl-[290px]' : 'pl-0'} ${sidebarToggle ? 'lg:pl-[290px]' : 'lg:pl-[80px]'}`}
                >
                    <Header
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        sidebarToggle={sidebarToggle}
                        setSidebarToggle={setSidebarToggle}
                    />
                </div>

                {/* Main Area */}
                <main
                    className={`flex-1 overflow-y-auto pt-[125px] px-4 md:px-6 transition-all duration-300
                        ${sidebarToggle ? 'pl-[290px]' : 'pl-0'} ${sidebarToggle ? 'lg:pl-[320px]' : 'lg:pl-[120px]'}`}
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-title-md2 font-bold text-primary dark:text-primary">
                                {getPageName()}
                            </h2>
                            <Breadcrumb pageName={getPageName()} />
                        </div>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
