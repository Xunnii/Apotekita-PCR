const Preloader = () => {
    return (
        <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
};

export default Preloader; 