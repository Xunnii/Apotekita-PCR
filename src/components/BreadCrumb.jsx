import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const BreadCrumb = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);

    // Build breadcrumb items
    const items = [
        {
            href: '/',
            title: <HomeOutlined />,
        },
        ...pathSnippets.map((segment, idx) => {
            const url = '/' + pathSnippets.slice(0, idx + 1).join('/');
            return {
                href: url,
                title: (
                    <span>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </span>
                ),
            };
        }),
    ];

    // Last item (current page) should not be a link
    if (items.length > 1) {
        items[items.length - 1] = {
            title: (
                <span>
                    {pathSnippets[pathSnippets.length - 1].charAt(0).toUpperCase() +
                        pathSnippets[pathSnippets.length - 1].slice(1)}
                </span>
            ),
        };
    }

    return <Breadcrumb separator=">" items={items} />;
};

export default BreadCrumb;