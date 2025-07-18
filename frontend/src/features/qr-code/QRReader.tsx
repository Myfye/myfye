// Styles
import { useEffect, useRef, useState } from "react";

// Qr Scanner
import QrScanner from "qr-scanner";

import qrScanOutline from "@/assets/svgs/qr-scan-outline.svg";

import { css } from "@emotion/react";

const QrReader = ({
  onScanSuccess,
  onScanFail,
  ...restProps
}: {
  onScanSuccess: (result: QrScanner.ScanResult) => void;
  onScanFail: (error: string | Error) => void;
}) => {
  const scanner = useRef<QrScanner>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLImageElement>(null);

  const [qrOn, setQrOn] = useState<boolean>(true);

  const isInit = useRef(false);

  useEffect(() => {
    if (isInit.current) return;
    async function startScanner() {
      try {
        await scanner?.current?.start();
        setQrOn(true);
      } catch (err) {
        setQrOn(false);
      }
    }

    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      startScanner();
      isInit.current = true;
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  });

  useEffect(() => {
    if (!qrOn)
      console.error(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and reload."
      );
  }, [qrOn]);

  return (
    <div
      className="qr-reader"
      css={css`
        position: relative;
        width: 100%;
        height: 100svh;
      `}
      {...restProps}
    >
      <div
        className="qr-video-wrapper"
        css={css`
          display: grid;
          place-items: center;
          aspect-ratio: 0.9;
          border-radius: var(--border-radius-medium);
          color: var(--clr-white);
          overflow: hidden;
          width: 100%;
          height: 100svh;
        `}
      >
        <video
          ref={videoEl}
          css={css`
            object-fit: cover;
            grid-area: 1/1;
            width: 100%;
            height: 100svh;
          `}
        ></video>
        <img
          ref={qrBoxEl}
          src={qrScanOutline}
          alt=""
          css={css`
            display: ${qrOn ? "block" : "none"};
            width: 100%;
            aspect-ratio: 1;
            grid-area: 1/1;
            pointer-events: none;
            object-fit: contain;
          `}
        />
      </div>
    </div>
  );
};

export default QrReader;
