import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import GalleryPage from './Gallery'

export default function page() {
    return (
        <div>
            <Navbar />
            <GalleryPage />
            <Footer />
        </div>
    )
};