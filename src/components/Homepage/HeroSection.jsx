export default function HeroSection() {
    return (
        <section className="bg-white py-16 font-Raleway">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="font-bold text-5xl md:text-6xl text-[#A63D3D] mb-6 leading-tight">
                        Words Which Don't <br /> All the Lors
                    </h1>
                    <p className="text-gray-700 mb-8 text-lg">
                        There are many variations of passages of Lorem Ipsu yes and moleculemaker characterization. Let our team and software help solve your problems.
                    </p>
                    <form className="flex mt-8 max-w-xl">
                        <input
                            type="text"
                            placeholder="psum used sinc"
                            className="flex-1 px-4 py-4 rounded-l-lg border border-gray-300 text-lg focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-[#A63D3D] text-white font-bold text-lg px-8 py-4 rounded-r-lg"
                        >
                            Use in touch
                        </button>
                    </form>
                </div>
                <div>
                    <div className="w-full h-[350px] bg-gray-300 rounded-md" />
                </div>
            </div>
        </section>
    );
}
