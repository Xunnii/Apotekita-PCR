import HeroSection from "../components/Homepage/HeroSection";
import Features from "../components/Homepage/FItur";
// Import komponen lain yang dikomentari jika diperlukan
import AboutSection from "../components/AboutSection";
// import CallToAction from "../components/CallToAction";
// import NewsSection from "../components/NewsSection";
// import TeamSection from "../components/TeamSection";
// import Testimonials from "../components/Testimonials";

export default function HomePage() {
    return (
        <div>
            <HeroSection />
            <AboutSection />
            <Features />
            {/* <CallToAction />
      <NewsSection />
      <TeamSection />
      <Testimonials /> */}
        </div>
    );
}