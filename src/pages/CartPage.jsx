import React, { useEffect, useState } from 'react';
import { Button, Card, InputNumber, Modal, Steps, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const { Step } = Steps;

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [alamat, setAlamat] = useState('');
    const [metodePembayaran, setMetodePembayaran] = useState('Transfer Bank');
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
        // Ambil alamat default dari profile jika ada
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                const { data: pelanggan } = await supabase
                    .from('pelanggan')
                    .select('alamat')
                    .eq('id', data.user.id)
                    .single();
                if (pelanggan?.alamat) setAlamat(pelanggan.alamat);
            }
        })();
    }, []);

    const handleRemove = (id, type) => {
        const newCart = cart.filter(item => !(item.id === id && item.type === type));
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const handleQuantityChange = (id, type, quantity) => {
        if (quantity <= 0) {
            handleRemove(id, type);
            return;
        }

        const newCart = cart.map(item =>
            item.id === id && item.type === type
                ? { ...item, quantity: quantity }
                : item
        );
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, item) => sum + (item.harga * (item.quantity || 1)), 0);

    const handleCheckout = () => {
        setShowConfirm(true);
    };

    const handleConfirmCheckout = async () => {
        if (!alamat || !metodePembayaran) {
            alert('Mohon lengkapi data checkout!');
            return;
        }
        setLoading(true);
        try {
            // 1. Cek user login
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                navigate('/login');
                return;
            }
            // 2. Ambil data user & pelanggan
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) {
                alert('Silakan login terlebih dahulu');
                setLoading(false);
                return;
            }
            const { data: pelanggan } = await supabase
                .from('pelanggan')
                .select('*')
                .eq('id', userData.user.id)
                .single();
            if (!pelanggan) {
                alert('Data pelanggan tidak ditemukan');
                setLoading(false);
                return;
            }
            // 3. Insert ke riwayat_pembelian untuk setiap item di cart
            for (const item of cart) {
                const payload = {
                    pelanggan_id: pelanggan.id,
                    produk_tipe: item.type,
                    produk_id: Number(item.id),
                    nama_produk: item.nama,
                    harga_produk: Number(item.harga),
                    jumlah: Number(item.quantity || 1),
                    total_pembelian: Number(item.harga) * Number(item.quantity || 1),
                    alamat_tujuan: alamat,
                    metode_pembayaran: metodePembayaran,
                    status_order: 'pending',
                    tanggal_transaksi: new Date().toISOString().slice(0, 10),
                };
                console.log('payload:', payload);
                const { error } = await supabase
                    .from('riwayat_pembelian')
                    .insert([payload]);
                if (error) {
                    alert('Gagal menyimpan riwayat pembelian: ' + error.message);
                    setLoading(false);
                    return;
                }
            }
            // 4. Kosongkan cart dan redirect
            localStorage.removeItem('cart');
            setCart([]);
            setShowConfirm(false);
            setLoading(false);
            navigate('/order-success');
        } catch (error) {
            alert('Terjadi kesalahan saat checkout');
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Keranjang</h2>
                <p className="text-gray-500 mb-4">Keranjang Anda kosong.</p>
                <div className="space-x-4">
                    <Button type="primary" onClick={() => navigate('/daftar-obat')}>
                        Belanja Obat
                    </Button>
                    <Button type="primary" onClick={() => navigate('/daftar-alkes')}>
                        Belanja Alat Kesehatan
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Keranjang Belanja</h2>
                <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                        <Card key={`${item.id}-${item.type}-${index}`} className="flex flex-row items-center">
                            <img
                                src={item.gambar}
                                alt={item.nama}
                                className="w-24 h-24 object-cover rounded mr-4"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-lg">{item.nama}</div>
                                <div className="text-gray-500 text-sm mb-1">
                                    {item.type === 'obat' ? 'Obat' : 'Alat Kesehatan'}
                                </div>
                                <div className="text-blue-600 font-bold mb-2">
                                    Rp {item.harga.toLocaleString()}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm">Jumlah:</span>
                                        <InputNumber
                                            min={1}
                                            value={item.quantity || 1}
                                            onChange={(value) => handleQuantityChange(item.id, item.type, value)}
                                            size="small"
                                        />
                                    </div>
                                    <div className="text-sm font-semibold">
                                        Subtotal: Rp {(item.harga * (item.quantity || 1)).toLocaleString()}
                                    </div>
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => handleRemove(item.id, item.type)}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="text-right font-bold text-xl mb-4">
                    Total: Rp {total.toLocaleString()}
                </div>
                <div className="flex space-x-4">
                    <Button
                        onClick={() => navigate('/daftar-obat')}
                        className="flex-1"
                    >
                        Lanjut Belanja
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleCheckout}
                        className="flex-1"
                        loading={loading}
                    >
                        Checkout
                    </Button>
                </div>
            </div>
            <Modal
                open={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onOk={handleConfirmCheckout}
                title="Konfirmasi Checkout"
                okText="Konfirmasi & Bayar"
                cancelText="Batal"
                confirmLoading={loading}
            >
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Alamat Tujuan</label>
                    <Input.TextArea
                        value={alamat}
                        onChange={e => setAlamat(e.target.value)}
                        rows={3}
                        placeholder="Masukkan alamat pengiriman"
                    />
                </div>
                <div className="mb-2">
                    <label className="block mb-1 font-semibold">Metode Pembayaran</label>
                    <Select
                        value={metodePembayaran}
                        onChange={setMetodePembayaran}
                        className="w-full"
                    >
                        <Select.Option value="Transfer Bank">Transfer Bank</Select.Option>
                        <Select.Option value="COD">COD</Select.Option>
                    </Select>
                </div>
            </Modal>
        </>
    );
} 