import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

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
        {children}
      </body>
    </html>
  );
}
