import qrOptions from "qr_options.json";
import baseLogoBlack from "@/assets/baseLogoBlack.png";
import solanaLogoBlack from "@/assets/solanaLogoBlack.png";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const QRCode = ({
  data = "",
  visible = true,
  color = "#f8fbfc",
  size = 256,
  className = "",
  chain = "base",
}) => {
  console.log('QR Code data:', data);
  if (!data) {
    console.log('No data provided to QR Code');
    return null;
  }

  const logo = chain === "base" ? baseLogoBlack : solanaLogoBlack;

  const qrCode = new QRCodeStyling({
    type: "svg",
    shape: "square",
    width: size,
    height: size,
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
      imageSize: 0.2,
      margin: 0,
    },
    dotsOptions: { type: "dots", color: color, roundSize: true },
    backgroundOptions: { round: 0, color: "transparent", gradient: null },
    image: logo,
    dotsOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: color,
        color2: color,
        rotation: "0",
      },
    },
    cornersSquareOptions: { type: "extra-rounded", color: color },
    cornersSquareOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: color, 
        color2: color,
        rotation: "0",
      },
    },
    cornersDotOptions: { type: "", color: color },
    cornersDotOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: color,
        color2: color,
        rotation: "0",
      },
    },
    backgroundOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: color,
        color2: color,
        rotation: "0",
      },
    },
  });

  const ref = useRef(null!);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [data]);

  return (
    <div
      ref={ref}
      className={`qr-code | ${className}`}
      css={css`
        display: ${visible ? "block" : "none"};
      `}
    ></div>
  );
};

export default QRCode;
