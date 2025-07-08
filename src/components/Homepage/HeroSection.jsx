import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
    const headline = "Selamat Datang Di  Apotek Keluarga";
    const [chars, setChars] = useState([]);
    const headlineRef = useRef(null);

    useEffect(() => {
        setChars(headline.split(""));
    }, [headline]);

    // Animasi headline per karakter
    useEffect(() => {
        if (headlineRef.current && headlineRef.current.children.length > 0) {
            gsap.fromTo(
                headlineRef.current.children,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                }
            );
        }
    }, [chars]);

    return (
        <section className="bg-white py-8 font-Raleway">
            <div className="container mx-auto px-5 grid md:grid-cols-2 gap-35 items-center">
                <div>
                    <h1
                        className="ml-6 font-Palisade text-9xl md:text-8xl text-[#A63D3D] mb-6 leading-tight flex flex-wrap"
                        ref={headlineRef}
                        aria-label={headline}
                    >
                        {chars.map((char, i) => (
                            <span
                                key={char + i}
                                style={{
                                    display: "inline-block",
                                    minWidth: char === " " ? "0.5em" : undefined
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </h1>
                    <p className="text-gray-700 mb-8 text-lg font-RalewayBold ml-10">
                        Kami menyediakan obat-obatan dan Alat kesehatan, kamu juga bisa memberi resep secara online!!
                    </p>
                    {/* <form className="flex mt-8 max-w-xl">
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
                    </form> */}
                </div>
                <div>
                    <img
                        src="/img/hero/image-hero.jpg"
                        alt="Blog Hero"
                        loading="lazy"
                        className="w-full h-auto max-w-2xl rounded-md shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
