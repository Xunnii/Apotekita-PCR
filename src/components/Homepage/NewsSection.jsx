export default function NewsSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-xl font-bold text-blue-800 mb-4">MicroEDLab in the News</h2>
                <p className="text-gray-600 text-sm mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-300 h-40 rounded"></div>
                    <div className="text-left">
                        <h3 className="text-md font-semibold">Non Characteristic Word: Of The Word</h3>
                        <a href="#" className="text-orange-500 text-sm hover:underline mt-2 inline-block">
                            Ethics Very →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
