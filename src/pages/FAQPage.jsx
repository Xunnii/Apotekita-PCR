import React, { useEffect, useState } from 'react';
import { Collapse, Spin, Alert } from 'antd';
import { getFAQs } from '../services/faqService';

const { Panel } = Collapse;

export default function FAQPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const data = await getFAQs();
                setFaqs(data);
            } catch (err) {
                setError('Gagal memuat FAQ: ' + (err.message || JSON.stringify(err)));
            } finally {
                setLoading(false);
            }
        }
        fetchFAQs();
    }, []);

    if (loading) return <Spin tip="Memuat FAQ..." style={{ width: '100%', marginTop: 40 }} />;
    if (error) return <Alert type="error" message={error} />;

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ flex: '1 1 350px', minWidth: 0 }}>
                    <Collapse accordion>
                        {faqs.map(faq => (
                            <Panel header={faq.pertanyaan} key={faq.id}>
                                <div>{faq.jawaban}</div>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
                <div style={{ flex: '1 1 300px', minWidth: 250, textAlign: 'center' }}>
                    <img
                        src="/img/Person looking through magnifying glass on question mark.jpg"
                        alt="FAQ Illustration"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: 12 }}
                    />
                </div>
            </div>
        </div>
    );
} 