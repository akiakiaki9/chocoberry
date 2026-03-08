import Navbar from '@/app/components/navbar/Navbar'
import React from 'react'
import Footer from '@/app/components/footer/Footer'
import ProductDetailPage from './CatalogDetail'

export default function page() {
    return (
        <div>
            <Navbar />
            <ProductDetailPage />
            <Footer />
        </div>
    )
};