const Overlay = ({ sidebarToggle, setSidebarToggle }) => {
    return (
        <div
            className={`fixed inset-0 z-9998 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${sidebarToggle ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={() => setSidebarToggle(false)}
        />
    );
};

export default Overlay; 