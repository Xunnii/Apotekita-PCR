import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertTestimoni } from '../services/profileService';
import { supabase } from '../config/supabase';
import { Form, Input, Button, Select, message, Card } from 'antd';

export default function TestimoniForm() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                message.error('Anda harus login untuk mengirim testimoni.');
                setLoading(false);
                return;
            }
            const pelanggan_id = userData.user.id;
            const { error } = await insertTestimoni({
                pelanggan_id,
                quote: values.quote,
                rating: values.rating
            });
            if (error) throw error;
            message.success('Testimoni berhasil dikirim! Menunggu persetujuan admin.');
            form.resetFields();
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            message.error('Gagal mengirim testimoni: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <Card title="Beri Testimoni" bordered={false}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Testimoni Anda"
                        name="quote"
                        rules={[{ required: true, message: 'Silakan isi testimoni Anda' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Tulis pengalaman Anda di sini..." />
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Pilih rating' }]}
                    >
                        <Select placeholder="Pilih rating">
                            {[5, 4, 3, 2, 1].map((val) => (
                                <Select.Option key={val} value={val}>{val} Bintang</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Kirim Testimoni
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
} 