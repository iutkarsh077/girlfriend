import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
