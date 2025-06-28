import HeroSection from "../../components/Homepage/HeroSection";
import Features from "../../components/Homepage/FItur";
// Import komponen lain yang dikomentari jika diperlukan
import AboutSection from "../../components/Homepage/AboutSection";
import CallToAction from "../../components/Homepage/CallToAction";
import NewsSection from "../../components/Homepage/NewsSection";
import TeamSection from "../../components/Homepage/TeamSection";
import Testimonials from "../../components/Homepage/Testimonials";

export default function HomePage() {
    return (
        <div>
            <HeroSection />
            <AboutSection />
            {/* <NewsSection /> */}
            <Features />
            {/* <CallToAction /> */}
            <TeamSection />
            <Testimonials />
        </div>
    );
}