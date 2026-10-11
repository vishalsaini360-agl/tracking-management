import React from "react";
import QRCode from "react-qr-code";

export default function Qrcode({qr}) {
  return (
    <div
      style={{ height: "auto", margin: "0 auto", maxWidth: 180, width: "100%" }}
    >
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={qr}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}
