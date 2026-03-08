import React from 'react'
import Navbar from '../components/navbar/Navbar'
import CatalogPage from './Catalog'
import Footer from '../components/footer/Footer'

export default function page() {
    return (
        <div>
            <Navbar />
            <CatalogPage />
            <Footer />
        </div>
    )
};