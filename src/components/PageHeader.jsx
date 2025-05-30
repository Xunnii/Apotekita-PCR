import { Link, useLocation } from 'react-router-dom';

export default function PageHeader() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <div className="bg-gray-100 px-6 py-4">
            <nav className="text-sm text-gray-600">
                <ul className="flex items-center space-x-2">
                    <li>
                        <Link to="/" className="text-blue-600 hover:underline">
                            Beranda
                        </Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;

                        return (
                            <li key={to} className="flex items-center space-x-2">
                                <span>/</span>
                                {isLast ? (
                                    <span className="text-gray-500 capitalize">{value.replace('-', ' ')}</span>
                                ) : (
                                    <Link to={to} className="text-blue-600 hover:underline capitalize">
                                        {value.replace('-', ' ')}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
