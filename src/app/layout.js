import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const poppinsFonts = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Girlfriend – Your Virtual Companion",
  description: "Connect with your AI-powered virtual girlfriend. Experience engaging conversations, emotional support, and personalized companionship 24/7.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppinsFonts.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DW7LMK4W2T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DW7LMK4W2T');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
