import { useState } from "react";

const testimonials = [
    {
        name: "Prof. Dignissi Ducimus",
        quote:
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum dele niti corrupti quos dol",
        title: "Finibus Bonorum et Malorum Dolor",
        img: null, // Ganti dengan path gambar jika ada
    },
    {
        name: "Dr. Ipsum Lorem",
        quote:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        title: "Classical Literature",
        img: null,
    },
    {
        name: "Ms. Example Name",
        quote:
            "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born.",
        title: "Theory of Ethics",
        img: null,
    },
];

export default function Testimonials() {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
    const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

    return (
        <section className="bg-[#f4f4f4] py-20 font-Raleway">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-[#A63D3D] mb-6 text-center leading-tight">
                    Passage, And Going The No <br /> Renaissance First Line Is
                </h2>
                <p className="text-xl text-black mb-12 max-w-2xl mx-auto text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
                    Duis euismod id magna vel tempor.
                </p>
                <div className="flex items-center justify-center">
                    {/* Prev Button */}
                    <button
                        onClick={prev}
                        className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mr-4 md:mr-8 text-2xl text-[#A63D3D] hover:bg-gray-200 transition"
                        aria-label="Previous"
                    >
                        &lt;
                    </button>
                    {/* Testimonial Card */}
                    <div className="bg-white rounded-xl shadow p-4 md:p-12 flex flex-col md:flex-row items-center w-full max-w-5xl">
                        {/* Placeholder Image */}
                        <div className="w-24 h-24 md:w-40 md:h-40 bg-gray-300 rounded-md mb-6 md:mb-0 md:mr-10 flex-shrink-0" />
                        <div className="text-left w-full">
                            <p className="font-bold text-lg md:text-2xl mb-4">{testimonials[index].quote}</p>
                            <p className="font-bold text-xl mb-1">{testimonials[index].name}</p>
                            <p className="text-[#A63D3D] font-medium">{testimonials[index].title}</p>
                        </div>
                    </div>
                    {/* Next Button */}
                    <button
                        onClick={next}
                        className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center ml-4 md:ml-8 text-2xl text-[#A63D3D] hover:bg-gray-200 transition"
                        aria-label="Next"
                    >
                        &gt;
                    </button>
                </div>
                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, i) => (
                        <span
                            key={i}
                            className={`w-3 h-3 rounded-full ${i === index ? "bg-[#A63D3D]" : "bg-gray-300"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
