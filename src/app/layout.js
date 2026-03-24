import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Chocoberry | Клубничные боксы и букеты в Бухаре",
    template: "%s | Chocoberry Бухара"
  },
  description: "Доставка свежих клубничных боксов, букетов из клубники и сладких композиций в Бухаре. Ручная работа, только свежие ягоды. Закажите вкусный подарок для любимых!",
  keywords: [
    "клубничные боксы Бухара",
    "клубничные букеты",
    "сладкие подарки Бухара",
    "клубника в шоколаде Бухара",
    "доставка клубники Бухара",
    "chocoberry bukhara",
    "клубничные композиции",
    "подарки из клубники"
  ],
  authors: [{ name: "Chocoberry" }],
  creator: "Chocoberry",
  publisher: "Chocoberry",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Добавьте код верификации Google Search Console
    yandex: "your-yandex-verification-code", // Добавьте код верификации Яндекс.Вебмастер
  },
  openGraph: {
    title: "Chocoberry | Клубничные боксы и букеты в Бухаре",
    description: "Доставка свежих клубничных боксов, букетов из клубники и сладких композиций в Бухаре. Ручная работа, только свежие ягоды.",
    url: "https://chocoberrybukhara.uz",
    siteName: "Chocoberry Бухара",
    images: [
      {
        url: "/og-image.jpg", // Добавьте изображение для соцсетей
        width: 1200,
        height: 630,
        alt: "Chocoberry - клубничные боксы и букеты",
      },
    ],
    locale: "ru_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chocoberry | Клубничные боксы и букеты в Бухаре",
    description: "Доставка свежих клубничных боксов, букетов из клубники и сладких композиций в Бухаре",
    images: ["/twitter-image.jpg"], // Добавьте изображение для Twitter
    creator: "@chocoberry", // Добавьте ваш Twitter аккаунт
  },
  alternates: {
    canonical: "https://chocoberrybukhara.uz",
    languages: {
      'ru': 'https://chocoberrybukhara.uz/ru',
      'uz': 'https://chocoberrybukhara.uz/uz',
    },
  },
  category: "food",
  manifest: "/manifest.json", // Для PWA
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#e31b23",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  other: {
    "yandex-verification": "your-yandex-verification-code",
    "google-site-verification": "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="geo.placename" content="Bukhara, Uzbekistan" />
        <meta name="geo.region" content="UZ-BU" />
        <meta name="geo.position" content="39.7747;64.4286" />
        <meta name="ICBM" content="39.7747, 64.4286" />

        {/* Структурированные данные Schema.org для локального бизнеса */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Chocoberry",
              "description": "Доставка клубничных боксов и букетов в Бухаре",
              "image": "https://chocoberrybukhara.uz/logo.png",
              "url": "https://chocoberrybukhara.uz",
              "telephone": "+998914433443",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bukhara",
                "addressCountry": "UZ"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "39.7747",
                "longitude": "64.4286"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "21:00"
              },
              "priceRange": "$$",
              "sameAs": [
                "https://www.instagram.com/chocoberry_bukhara",
                "https://t.me/chocoberry_bukhara"
              ]
            })
          }}
        />

        {/* Структурированные данные для продуктов */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Клубничные боксы и букеты",
              "description": "Свежие клубничные композиции ручной работы",
              "brand": {
                "@type": "Brand",
                "name": "Chocoberry"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "UZS",
                "lowPrice": "100000",
                "highPrice": "500000",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />

        {/* Превью для мессенджеров */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="vk:image" content="/vk-image.jpg" />
        <meta name="telegram:channel" content="@chocoberry_bukhara" />

        {/* Оптимизация для мобильных устройств */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Chocoberry" />

        {/* Дополнительные мета-теги */}
        <meta name="theme-color" content="#e31b23" />
        <meta name="msapplication-TileColor" content="#e31b23" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
};