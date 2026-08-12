// app/ClientLayout.jsx
'use client';

import { useState } from 'react';
import MobileBottomNav from './components/mobileNav/MobileBottomNav';
import Cart from './components/cart/Cart';
export default function ClientLayout({ children }) {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleCartOpen = () => {
        console.log('Opening cart...');
        setIsCartOpen(true);
    };

    const handleCartClose = () => {
        console.log('Closing cart...');
        setIsCartOpen(false);
    };

    return (
        <>
            {children}

            {/* Мобильная навигация */}
            <MobileBottomNav onCartOpen={handleCartOpen} />

            {/* Корзина */}
            <Cart isOpen={isCartOpen} onClose={handleCartClose} />
        </>
    );
}