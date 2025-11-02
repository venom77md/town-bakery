import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import LayoutWrapper from './LayoutWrapper'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo'
})

export const metadata: Metadata = {
  title: 'Town Bakery - مخبز تاون',
  description: 'خبز طازج يومياً ومخبوزات عالية الجودة من Town Bakery. طلبك متاح الآن!',
  keywords: 'مخبز, خبز طازج, معجنات, حلويات, Town Bakery, تاون بيكري',
  authors: [{ name: 'Town Bakery' }],
  openGraph: {
    title: 'Town Bakery - مخبز تاون',
    description: 'خبز طازج يومياً ومخبوزات عالية الجودة',
    type: 'website',
    locale: 'ar_EG',
    siteName: 'Town Bakery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Town Bakery - مخبز تاون',
    description: 'خبز طازج يومياً ومخبوزات عالية الجودة',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="ar" dir="rtl">
      <head>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className={`${cairo.variable} font-arabic`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
