import Header from "../components/Header";
import Footer from "../components/Footer";
// import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-white-50">
            <Header />
            {/* <PageHeader /> */}
            <div className=" font-semibold  mr-1 ml-4 mb-1 mt-2"> {/* Tambahkan wrapper dan styling di sini */}
                <BreadCrumb />
            </div>
            <div className="flex-1 p-2">

                <Outlet />
            </div>
            <Footer />
        </div>
    );
}