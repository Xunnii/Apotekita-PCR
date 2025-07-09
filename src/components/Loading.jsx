import React from 'react';
import { Spin } from 'antd';

export default function Loading() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" tip="Loading..." />
        </div>
    );
}