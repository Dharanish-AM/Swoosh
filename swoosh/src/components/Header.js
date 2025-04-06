import Image from "next/image";
import Logo from "@/assets/icons/Swoosh-Logo.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <div className="header">
     <div className="logo"></div> 
      <div className="hero-container">
        <span className="hero-text-1">Swoosh Your Files Instantly!</span>
        <span className="hero-text-2">
          Fast, Secure, and Hassle-Free File Transfers
        </span>
      </div>
      {/* <div></div> */}
    </div>
  );
}
