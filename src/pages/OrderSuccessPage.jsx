import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Steps } from 'antd';
import { CheckCircleOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons';

const { Step } = Steps;

export default function OrderSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderNumber, total, items } = location.state || {};

    if (!orderNumber) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <CheckCircleOutlined
                        style={{ fontSize: '64px', color: '#52c41a' }}
                        className="mb-4"
                    />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Pesanan Berhasil!
                    </h1>
                    <p className="text-gray-600">
                        Terima kasih telah berbelanja di Apotekita PCR
                    </p>
                </div>

                {/* Order Details */}
                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Detail Pesanan</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-semibold">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Items:</span>
                            <span className="font-semibold">{items} item(s)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-semibold text-lg text-blue-600">
                                Rp {total?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-semibold text-yellow-600">Pending Payment</span>
                        </div>
                    </div>
                </Card>

                {/* Next Steps */}
                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Langkah Selanjutnya</h2>
                    <Steps direction="vertical" size="small">
                        <Step
                            title="Konfirmasi Pembayaran"
                            description="Lakukan pembayaran sesuai metode yang dipilih"
                            icon={<ShoppingOutlined />}
                        />
                        <Step
                            title="Verifikasi Pembayaran"
                            description="Tim kami akan memverifikasi pembayaran Anda"
                        />
                        <Step
                            title="Pesanan Diproses"
                            description="Pesanan akan diproses dan dikemas"
                        />
                        <Step
                            title="Pengiriman"
                            description="Pesanan akan dikirim ke alamat Anda"
                        />
                        <Step
                            title="Pesanan Diterima"
                            description="Pesanan telah sampai di tujuan"
                        />
                    </Steps>
                </Card>

                {/* Payment Instructions */}
                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Instruksi Pembayaran</h2>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Transfer Bank</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Bank BCA:</strong> 1234567890</p>
                            <p><strong>Atas Nama:</strong> Apotekita PCR</p>
                            <p><strong>Jumlah:</strong> Rp {total?.toLocaleString()}</p>
                            <p className="text-red-600 font-semibold">
                                ⚠️ Harap transfer sesuai jumlah yang tertera
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        type="primary"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                        className="flex-1"
                    >
                        Kembali ke Beranda
                    </Button>
                    <Button
                        size="large"
                        onClick={() => navigate('/profile')}
                        className="flex-1"
                    >
                        Lihat Pesanan Saya
                    </Button>
                </div>

                {/* Contact Info */}
                <div className="text-center mt-8 text-gray-500">
                    <p>Ada pertanyaan? Hubungi kami di:</p>
                    <p className="font-semibold">📞 0812-3456-7890 | 📧 info@apotekita-pcr.com</p>
                </div>
            </div>
        </div>
    );
} 