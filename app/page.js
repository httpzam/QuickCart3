"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function ScannerPage() {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const [cameraFacing, setCameraFacing] = useState("environment");
  const [scanning, setScanning] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    startScanner();
    return () => {
      codeReader.current.reset();
    };
  }, [cameraFacing]);

  const startScanner = async () => {
    setScanning(true);

    try {
      const constraints = {
        video: { facingMode: cameraFacing }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;

      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            handleScan(result.getText());
          }
        }
      );
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const handleScan = async (barcode) => {
    setScanning(false);

    // Replace this with your real backend URL
    const res = await fetch(`/api/products/${barcode}`);

    if (!res.ok) {
      setNotFound(true);
      return;
    }

    const product = await res.json();
    setPopupData(product);
    setQty(1);
  };

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      ...popupData,
      qty,
      total: qty * popupData.price
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    setPopupData(null);
    setScanning(true);
  };

  return (
    <>
      <header>
        <h3>QuickCart Scanner</h3>
      </header>

      <div id="scanner-container">
        <div className="video-wrapper">
          <video id="scanner" ref={videoRef} autoPlay muted playsInline />
          <div className="laser-line"></div>

          <div className="flip-btn-box">
            <button
              id="flip-btn"
              onClick={() =>
                setCameraFacing((prev) =>
                  prev === "environment" ? "user" : "environment"
                )
              }
            >
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/switch-camera.png"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Product Popup */}
      {popupData && (
        <div className="popup-overlay" style={{ display: "flex" }}>
          <div className="popup-content">
            <div id="popup-details">
              <div className="popup-row">
                <span>Description:</span>
                <span>{popupData.description}</span>
              </div>

              <div className="popup-row">
                <span>Unit Price:</span>
                <span>{popupData.price}</span>
              </div>

              <div className="popup-row">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </div>
            </div>

            <div id="popup-actions">
              <button onClick={() => setPopupData(null)}>Cancel</button>
              <button className="add-btn" onClick={addToCart}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not found popup */}
      {notFound && (
        <div className="popup-overlay" style={{ display: "flex" }}>
          <div className="popup-content" style={{ background: "#f8d7da" }}>
            <h3>Product not found</h3>
            <button onClick={() => setNotFound(false)}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        ${cssContent} /* Inserted below */
      `}</style>
    </>
  );
}

// CSS (same from your <style> tag)
const cssContent = `
  /* your full CSS here… same as HTML original */
`;
