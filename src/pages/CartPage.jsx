import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
    }, []);

    const handleRemove = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, item) => sum + item.harga, 0);

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Keranjang</h2>
                <p className="text-gray-500">Keranjang Anda kosong.</p>
                <Button type="primary" onClick={() => navigate('/daftar-obat')} className="mt-4">Belanja Obat</Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Keranjang</h2>
            <div className="space-y-4 mb-6">
                {cart.map(item => (
                    <Card key={item.id} className="flex flex-row items-center">
                        <img src={item.gambar} alt={item.nama_obat} className="w-24 h-24 object-cover rounded mr-4" />
                        <div className="flex-1">
                            <div className="font-semibold text-lg">{item.nama_obat}</div>
                            <div className="text-gray-500 text-sm mb-1">{item.kategori}</div>
                            <div className="text-blue-600 font-bold mb-2">Rp {item.harga.toLocaleString()}</div>
                            <Button danger size="small" onClick={() => handleRemove(item.id)}>Hapus</Button>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="text-right font-bold text-lg mb-4">Total: Rp {total.toLocaleString()}</div>
            <Button type="primary" className="w-full">Checkout</Button>
        </div>
    );
} 