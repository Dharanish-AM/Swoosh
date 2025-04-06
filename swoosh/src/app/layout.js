import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import "../styles/layout.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Swoosh - File Sharing Made Easy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${MontserratFont.variable} antialiased`}>
        <main className="main-container">
          <div className="top-left-design"></div>
          <div className="top-right-design"></div>
          <Header />
          {children}
          <Footer />
          <div className="bottom-left-design"></div>
          <div className="bottom-right-design"></div>
        </main>
      </body>
    </html>
  );
}
