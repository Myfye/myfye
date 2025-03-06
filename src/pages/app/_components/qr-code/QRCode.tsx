import qrOptions from "qr_options.json";
import logo from "@/assets/Logo.png";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const QRCode = ({
  data = "https://qr-code-styling.com",
  visible = "true",
  color = "#f8fbfc",
  size = 300,
  className = "",
}) => {
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
      imageSize: 0.5,
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
    qrCode.append(ref.current);
  }, []);

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
