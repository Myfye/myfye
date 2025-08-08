import baseLogoBlack from "@/assets/baseLogoBlack.png";
import solanaLogoBlack from "@/assets/solanaLogoBlack.png";
import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

import { css } from "@emotion/react";
import RingLoader from "@/shared/components/ui/loading/spinners/RingLoader";

const QRCode = ({
  data = "",
  visible = true,
  color = "#f8fbfc",
  size = 256,
  className = "",
  chain = "solana",
}) => {
  const logo = chain === "base" ? baseLogoBlack : solanaLogoBlack;
  const [isLoading, setLoading] = useState(false);

  const qrCode = new QRCodeStyling({
    type: "svg",
    shape: "square",
    width: size,
    height: size,
    data: data,
    margin: 0,
    qrOptions: {
      typeNumber: 0,
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
    backgroundOptions: { round: 0, color: "transparent" },
    image: logo,
    cornersSquareOptions: { type: "extra-rounded", color: color },
    cornersDotOptions: { color: color },
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode.append(ref.current);
    }
  }, [data]);

  return (
    <div
      ref={ref}
      className={`qr-code | ${className}`}
      css={css`
        display: ${visible ? "grid" : "none"};
        place-items: center;
        width: ${size}px;
        height: ${size}px;
      `}
    >
      {/* {isLoading && <RingLoader width={24} height={24} />} */}
    </div>
  );
};

export default QRCode;
