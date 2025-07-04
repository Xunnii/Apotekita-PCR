import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import Loading from './components/Loading';
import './assets/tailwind.css';
import AdminLayout from './layout/AdminLayout';
import BlankPage from './pages/admin/BlankPage';
import NotePages from './pages/admin/NoterPage';
// import MedicineDashboard from './components/admin/MedicineDashboard';
import MedicinePage from './pages/admin/MedicinePage';
import ConsultationAdminPage from './pages/admin/ConsultationAdminPage';
import PrivateRoute from './components/PrivateRoute';
import AlkesPage from './pages/admin/AlkesPage';
// import AdminLayout from './layout/AdminLayout';

// Lazy load components
const HomePage = lazy(() => import('./pages/guest/HomePage'));
// const HomePage = lazy(() => import('./pages/HomePage'));
const ApotekerPage = lazy(() => import('./pages/guest/ApotekerPage'));
const DaftarObatPage = lazy(() => import('./pages/guest/DaftarObatPage'));
const DetailObatPage = lazy(() => import('./pages/guest/DetailObatPage'));
const CekMataPage = lazy(() => import('./pages/guest/CekMataPage'));
const KonsultasiDokter = lazy(() => import('./pages/guest/KonsultasiDokterPage'));
const ErrorPage = lazy(() => import('./components/ErrorPage'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Forgot = lazy(() => import('./pages/Auth/Forgot'));
const Register = lazy(() => import('./pages/Auth/Register'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const DaftarAlkesPage = lazy(() => import('./pages/guest/DaftarAlkesPage'));
const DetailAlkesPage = lazy(() => import('./pages/guest/DetailAlkesPage'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main/Home */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/daftar-obat" element={<DaftarObatPage />} />
          <Route path="/daftar-alkes" element={<DaftarAlkesPage />} />
          <Route path="/detail-obat/:id" element={<DetailObatPage />} />
          <Route path="/detail-alkes/:id" element={<DetailAlkesPage />} />
          <Route path="/cek-mata" element={<CekMataPage />} />
          <Route path="/konsultasi-dokter" element={<KonsultasiDokter />} />
          <Route path="/apoteker" element={<ApotekerPage />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/keranjang" element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          } />
        </Route>

        {/* ADMIN - diproteksi dengan PrivateRoute */}
        <Route path="/admin" element={
          // <PrivateRoute>
          <AdminLayout />
          // </PrivateRoute>
        }>
          {/* <Route index element={<BlankPage />} /> */}
          <Route index element={<DashboardPage />} />
          <Route path="blank" element={<BlankPage />} />
          <Route path="notes" element={<NotePages />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="medicine" element={<MedicinePage />} />
          <Route path="alkes" element={<AlkesPage />} />
          <Route path="konsultasi-dokter" element={<ConsultationAdminPage />} />
        </Route>

        {/* Rute halaman error - tanpa MainLayout */}
        <Route path="/error-400" element={<ErrorPage kode={400} />} />
        <Route path="/error-401" element={<ErrorPage kode={401} />} />
        <Route path="/error-403" element={<ErrorPage kode={403} />} />

        {/* Catch-all route (404) */}
        <Route path="*" element={<ErrorPage kode={404} />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}