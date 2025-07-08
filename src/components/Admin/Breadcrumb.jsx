import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ pageName }) => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    return (
        <div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-md2 font-bold text-black dark:text-white">
                {pageName}
            </h2>

            <nav>
                <ol className="flex items-center gap-2">
                    <li>
                        <Link className="font-medium" to="/admin/dashboard">
                            Home
                        </Link>
                    </li>
                    {pathSegments.map((segment, index) => (
                        <li key={index} className="font-medium text-primary">
                            / {segment.charAt(0).toUpperCase() + segment.slice(1)}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumb; 