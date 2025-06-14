import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import Loading from './components/Loading';
import './assets/tailwind.css';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
// const HomePage = lazy(() => import('./pages/HomePage'));
const ApotekerPage = lazy(() => import('./pages/ApotekerPage'));
const DaftarObatPage = lazy(() => import('./pages/DaftarObatPage'));
const DetailObatPage = lazy(() => import('./pages/DetailObatPage'));
const CekMataPage = lazy(() => import('./pages/CekMataPage'));
const KonsultasiDokter = lazy(() => import('./pages/KonsultasiDokterPage'));
const ErrorPage = lazy(() => import('./components/ErrorPage'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Forgot = lazy(() => import('./pages/Auth/Forgot'));
const Register = lazy(() => import('./pages/Auth/Register'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rute dengan MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/daftar-obat" element={<DaftarObatPage />} />
          <Route path="/detail-obat/:id" element={<DetailObatPage />} />
          <Route path="/cek-mata" element={<CekMataPage />} />
          <Route path="/konsultasi-dokter" element={<KonsultasiDokter />} />
          <Route path="/apoteker" element={<ApotekerPage />} />
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