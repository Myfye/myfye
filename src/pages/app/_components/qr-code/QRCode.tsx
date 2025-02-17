import qrOptions from "qr_options.json";
import logo from "@/assets/Logo.png";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const QRCode = ({ data = "https://qr-code-styling.com", visible }) => {
  const qrCode = new QRCodeStyling({
    type: "svg",
    shape: "square",
    width: 300,
    height: 300,
    data: data,
    margin: 0,
    qrOptions: {
      typeNumber: "0",
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      saveAsBlob: true,
      hideBackgroundDots: true,
      imageSize: 0.5,
      margin: 0,
    },
    dotsOptions: { type: "classy", color: "#f8fbfc", roundSize: true },
    backgroundOptions: { round: 0, color: "#000407", gradient: null },
    image: logo,
    dotsOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#f8fbfc",
        color2: "#f8fbfc",
        rotation: "0",
      },
    },
    cornersSquareOptions: { type: "extra-rounded", color: "#f8fbfc" },
    cornersSquareOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#f8fbfc",
        color2: "#f8fbfc",
        rotation: "0",
      },
    },
    cornersDotOptions: { type: "", color: "#f8fbfc" },
    cornersDotOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#f8fbfc",
        color2: "#f8fbfc",
        rotation: "0",
      },
    },
    backgroundOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#f8fbfc",
        color2: "#f8fbfc",
        rotation: "0",
      },
    },
  });

  const ref = useRef(null!);

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      css={css`
        display: ${visible ? "block" : "none"};
      `}
    ></div>
  );
};

export default QRCode;
