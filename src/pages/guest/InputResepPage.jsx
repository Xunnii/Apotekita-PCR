import React, { useState } from 'react';
import { Form, Input, Upload, Button, Card, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadResepImage, insertObatResep } from '../../services/obatResepService';

export default function InputResepPage() {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null); // { type: 'success'|'error', message: string }
    // Untuk auto-dismiss alert
    React.useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        console.log('Form values:', values); // debug
        setLoading(true);
        try {
            // Ambil file dari Upload (fileList)
            const file = values.gambar?.[0]?.originFileObj;
            if (!file) throw new Error('Gambar resep wajib diupload');
            // Guest: user_id bisa null/guest
            const imagePath = await uploadResepImage(file, 'guest');
            // Simpan ke tabel obatresep
            await insertObatResep({ keterangan: values.keterangan, gambar: imagePath });
            form.resetFields();
            setAlert({ type: 'success', message: 'Resep berhasil dikirim! Kami akan segera memprosesnya.' });
        } catch (err) {
            setAlert({ type: 'error', message: 'Gagal mengirim resep: ' + (err.message || '') });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
            <Card title="Kirim Resep Obat" variant="outlined">
                {alert && (
                    <Alert
                        style={{ marginBottom: 16 }}
                        message={alert.message}
                        type={alert.type}
                        showIcon
                        closable
                        onClose={() => setAlert(null)}
                    />
                )}
                <Form layout="vertical" form={form} onFinish={handleFinish}>
                    <Form.Item
                        label="Keterangan"
                        name="keterangan"
                        rules={[{ required: true, message: 'Keterangan wajib diisi' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Tulis keterangan tambahan (opsional)" />
                    </Form.Item>
                    <Form.Item
                        label="Upload Foto Resep"
                        name="gambar"
                        valuePropName="fileList"
                        getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                        rules={[{ required: true, message: 'Foto resep wajib diupload' }]}
                    >
                        <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                            <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Kirim Resep
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
} 