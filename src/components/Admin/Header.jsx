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
                                    <span> ⌘ </span>
                                    <span> K </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={`shadow-theme-md w-full items-center justify-between gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:shadow-none ${searchOpen ? 'flex' : 'hidden'}`}>
                    <div className="2xsm:gap-3 flex items-center gap-2">
                        <button className="hover:text-dark-900 relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                            <BellIcon className="h-5 w-5" />
                            <span className="absolute top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-orange-400">
                                <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                            </span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-4"
                            >
                                <span className="h-12 w-12 rounded-full">
                                    <UserCircleIcon className="h-full w-full text-gray-500" />
                                </span>
                                <span className="hidden text-left lg:block">
                                    <span className="block text-sm font-medium text-gray-900">
                                        Admin User
                                    </span>
                                    <span className="block text-xs text-gray-500">Administrator</span>
                                </span>
                                <ChevronDownIcon className="hidden sm:block h-3 w-3 fill-current text-gray-500" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default">
                                    <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5">
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                            >
                                                My Profile
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                            >
                                                Settings
                                            </a>
                                        </li>
                                    </ul>
                                    <button className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb */}

        </header>
    );
};

export default Header;