import React from "react";
import { FaLock } from "react-icons/fa";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <FaLock size={"0.9rem"} color="#737373" />
        <div className="footer-text">Files are end-to-end encrypted</div>
      </div>
    </div>
  );
}
