import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const Header = ({ sidebarToggle, setSidebarToggle, darkMode, setDarkMode }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const location = useLocation();

    // Get page name from path
    const getPageName = () => {
        const path = location.pathname.split('/').pop();
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <header className="sticky top-0 z-99999 flex w-full flex-col border-gray-200 bg-white lg:border-b">
            <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
                <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarToggle(!sidebarToggle);
                        }}
                        className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg border-gray-200 text-gray-500 hover:bg-gray-100 lg:h-11 lg:w-11 lg:border"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <div className="hidden lg:block">
                        <form>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2">
                                    <MagnifyingGlassIcon className="h-5 w-5 fill-gray-500" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search or type command..."
                                    className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px]"
                                />
                                <button
                                    className="absolute top-1/2 right-2.5 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500"
                                >
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={`shadow-theme-md w-full items-center justify-between gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:shadow-none ${searchOpen ? 'flex' : 'hidden'}`}>
                    <div className="2xsm:gap-3 flex items-center gap-2">
                    </div>
                </div>
            </div>
            {/* Breadcrumb */}

        </header>
    );
};

export default Header;