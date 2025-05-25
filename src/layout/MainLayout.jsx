import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <PageHeader />
            <div className="flex-1 p-4">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}