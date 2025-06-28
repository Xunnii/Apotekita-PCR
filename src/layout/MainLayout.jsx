import Header from "../components/Header";
import Footer from "../components/Footer";
// import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            {/* <PageHeader /> */}
            <div className=" font-semibold  p-4"> {/* Tambahkan wrapper dan styling di sini */}
                <BreadCrumb />
            </div>
            <div className="flex-1 p-4">

                <Outlet />
            </div>
            <Footer />
        </div>
    );
}