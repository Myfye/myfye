// Styles
import { useEffect, useRef, useState } from "react";

// Qr Scanner
import QrScanner from "qr-scanner";

import qrScanOutline from "@/assets/svgs/qr-scan-outline.svg";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const QrReader = ({ onClose, ...restProps }) => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);

  const [qrOn, setQrOn] = useState<boolean>(true);

  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
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
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div
      className="qr-reader"
      css={css`
        position: relative;
      `}
      {...restProps}
    >
      <div
        className="qr-video-wrapper"
        css={css`
          display: grid;
          aspect-ratio: 0.9;
          border-radius: var(--border-radius-medium);
          color: var(--clr-white);
          overflow: hidden;
        `}
      >
        <video
          ref={videoEl}
          css={css`
            object-fit: cover;
            grid-area: 1/1;
            width: 100%;
            height: 100%;
          `}
        ></video>
        <img
          src={qrScanOutline}
          alt=""
          css={css`
            width: 100%;
            height: 100%;
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
