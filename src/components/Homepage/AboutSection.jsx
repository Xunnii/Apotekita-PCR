export default function InfoSection() {
    return (
        <section className="bg-gray-100 py-24 font-Raleway">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Kiri: Gambar/Placeholder */}
                <div>
                    <div className="w-full h-[350px] bg-gray-300 rounded-md" />
                    {/* Ganti div di atas dengan <img src=\"...\" /> jika ingin gambar */}
                </div>
                {/* Kanan: Teks */}
                <div>
                    <h2 className="text-4xl font-bold text-[#A63D3D] mb-6">Labor Ur</h2>
                    <p className="text-gray-800 text-lg mb-8 leading-relaxed">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. <br /><br />
                        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first-line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes. Lorem Ipsum is simply dummy text of the printing and typesetting.
                    </p>
                    <a
                        href="#"
                        className="text-[#A63D3D] font-bold text-lg flex items-center hover:underline transition"
                    >
                        Learn Labor the Don'ts
                        <span className="ml-2 text-2xl">&rarr;</span>
                    </a>
                </div>
            </div>
        </section>
    );
} 