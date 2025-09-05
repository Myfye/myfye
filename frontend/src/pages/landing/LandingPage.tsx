import Header from "./_components/Header";
import Main from "./_components/Main";

import { useEffect, useRef, useState } from "react";
import QRCodeModal from "./_components/QRCodeModal";
import { useNavigate } from "react-router-dom";
import { checkIfMobileOrTablet } from "@/shared/utils/mobileUtils";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import QRCodePopup from "./_components/QRCodePopup";
import { QRCodeModalContext } from "./QRCodeModalContext";
import Mockup from "./_components/Mockup";
import PoweredBy from "./_components/PoweredBy";
import ProductFeatures from "./_components/ProductFeatures";
import Swap from "./_components/Swap";
import LastCTA from "./_components/LastCTA";

const LandingPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth <= 1080;
      if (!isSmallScreen && !checkIfMobileOrTablet()) {
        navigate("/");
      } else {
        navigate("/app");
      }
    };

    // Check on initial render
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [navigate]);

  const lastCTARef = useRef<HTMLElement>(null!);

  return (
    <>
      <QRCodeModalContext
        value={{ isOpen: isModalOpen, setModalOpen: setModalOpen }}
      >
        <div className="landing-page">
          <Header />
          <Main>
            <Hero />
            <Mockup />
            <PoweredBy />
            <ProductFeatures />
            <Swap />
            <LastCTA ref={lastCTARef} />
          </Main>
          <Footer />
        </div>
        <QRCodeModal
          isOpen={isModalOpen}
          onOpenChange={(isOpen) => setModalOpen(isOpen)}
        />
        <QRCodePopup intersectRef={lastCTARef} />
      </QRCodeModalContext>
    </>
  );
};

export default LandingPage;
