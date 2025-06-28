const NotePages = () => {
    return (
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="mx-auto w-full max-w-[630px] text-center">
                <h3 className="mb-4 text-theme-xl font-semibold text-gray-700 sm:text-2xl">
                    Welcome to Notes Page
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                    This is a Notes Page. You can start adding your content here.
                    You can use different combinations of grids and components to build your admin interface.
                </p>
            </div>
        </div>
    );
};

export default NotePages; 