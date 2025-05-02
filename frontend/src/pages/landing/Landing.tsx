import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import LandingContactForm from "./LandingContactForm";
import Logo from "../../assets/Logo.png";
import myfyeLogo from "../../assets/myfyeLogo3.png";
import MyFyeQRCode3 from "../../assets/MyfyeQRCode3.png";
import group136 from "../../assets/appShowcase.png";
import sendHomePage from "../../assets/sendHomepage.png";
import earnHomePage from "../../assets/earnHomepage.png";
import walletHomePage from "../../assets/walletHomepage.png";
import cryptoStocksHomePage from "../../assets/cryptoStocksHomepage.png";
import poweredByUSDC from "../../assets/poweredByUSDC.png";
import poweredByOndo from "../../assets/poweredByOndo.png";
import poweredByDinari from "../../assets/poweredByDinari.png";
import poweredBySolana from "../../assets/poweredBySolana.png";
import dinari from "../../assets/poweredByDinari.png";

function Landing() {
  const navigate = useNavigate();
  const isSmallScreen = window.innerWidth <= 768;
  const [goToDashboardIsHovered, setgoToDashboardIsHovered] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("stocksAndCrypto");
  const [sendMessageToggled, setsendMessageToggled] = useState(false);
  const { lang } = useParams<{ lang: string }>();

  document.body.style.overflowX = "hidden";
  document.body.style.overflowY = "auto";

  const getImageSrc = () => {
    switch (selectedProduct) {
      case "wallet":
        return walletHomePage;
      case "earn":
        return earnHomePage;
      case "send":
        return sendHomePage;
      case "stocksAndCrypto":
        return cryptoStocksHomePage;
      default:
        return walletHomePage; // Optional: Add a default image if needed
    }
  };

  const getPoweredByImageSrc = () => {
    switch (selectedProduct) {
      case "wallet":
        return poweredByUSDC;
      case "earn":
        return poweredByOndo;
      case "send":
        return poweredBySolana;
      case "stocksAndCrypto":
        return poweredByDinari;
      default:
        return poweredByUSDC; // Optional: Add a default image if needed
    }
  };

  return (
    <div>
      {/* Banner for Web App Launch */}
      <div
        style={{
          backgroundColor: "#447E26",
          color: "white",
          textAlign: "center",
          padding: "10px",
          fontWeight: "bold",
          fontSize: isSmallScreen ? "16px" : "20px",
        }}
      >
        Going Live On May 6th!
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-40px",
        }}
      >
        <img
          src={myfyeLogo}
          style={{
            width: "auto",
            height: isSmallScreen ? "120px" : "200px",
            marginTop: isSmallScreen ? "20px" : "0px",
          }}
        ></img>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          margin: "0 auto",
          maxWidth: "1500px",
          gap: isSmallScreen ? "20px" : "-40px",
          height: isSmallScreen ? "auto" : "calc(100vh - 70px)",
          whiteSpace: "nowrap",
          marginTop: isSmallScreen ? "0" : "-85px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: isSmallScreen ? "auto" : "400px",
            maxWidth: isSmallScreen ? "90vw" : "45vw",
            marginTop: "30px",
            marginBottom: "30px",
            justifyContent: "space-around",
            color: "#333333",
            textAlign: isSmallScreen ? "center" : "left",
          }}
        >
          <div
            style={{
              color: "#447E26",
              fontSize: isSmallScreen
                ? "clamp(30px, 5vh, 40px)"
                : "clamp(40px, 7.1vh, 80px)",
              fontWeight: "bold",
            }}
          >
            Your Money, Your Phone.
            <br />
            No Bank Needed.
          </div>
          <div
            style={{
              color: "#333333",
              fontSize: isSmallScreen
                ? "clamp(16px, 2.5vh, 20px)"
                : "clamp(20px, 3.1vh, 50px)",
            }}
          >
            Hold <span style={{ fontWeight: "bold" }}>Stocks</span>,{" "}
            <span style={{ fontWeight: "bold" }}></span>
            <span style={{ fontWeight: "bold" }}> US Gov. Treasury Bonds</span>,
            <br />
            <span style={{ fontWeight: "bold" }}>Crypto</span> and more directly
            on your phone.
          </div>

          <div
            style={{
              color: "#333333",
              fontSize: isSmallScreen
                ? "clamp(16px, 2.5vh, 20px)"
                : "clamp(20px, 3.1vh, 50px)",
            }}
          >
            Send and receive US Dollars and Euros instantly from
            <br /> anywhere in the world{" "}
            <span style={{ fontWeight: "bold" }}> for free</span>.
          </div>

          {
            <div
              style={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: isSmallScreen ? "100%" : "340px",
                margin: isSmallScreen ? "20px auto" : "0",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: isSmallScreen
                    ? "clamp(30px, 5vh, 40px)"
                    : "clamp(40px, 7.1vh, 80px)",
                  marginRight: isSmallScreen ? "0" : "15px",
                  whiteSpace: "nowrap",
                  marginBottom: isSmallScreen ? "20px" : "0",
                }}
              >
                Try the beta!
              </div>
              <img
                src={MyFyeQRCode3}
                alt="qrCode"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "20px",
                }}
              />
            </div>
          }
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isSmallScreen ? "40px" : "0",
          }}
        >
          <img
            src={group136}
            style={{
              width: "auto",
              height: isSmallScreen ? "400px" : "600px",
              marginRight: isSmallScreen ? "50px" : "0px",
            }}
          />
        </div>
        {/*
    <img src = {manWithPhone3} style={{
      height: 'calc(100vh-200px)', 
      width: 'auto',
      marginLeft: '-10vw',
      zIndex: -1
      }}></img>
          */}
      </div>

      <div
        style={{
          height: isSmallScreen ? "auto" : "100vh",
          marginTop: isSmallScreen ? "40px" : "10px",
          marginBottom: "100px",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ padding: isSmallScreen ? "40px 20px" : "100px" }}>
          <div
            style={{
              color: "#447E26",
              fontSize: isSmallScreen
                ? "clamp(30px, 5vh, 40px)"
                : "clamp(40px, 7.1vh, 80px)",
              fontWeight: "bold",
              textAlign: isSmallScreen ? "center" : "left",
            }}
          >
            Our Products
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: isSmallScreen ? "90%" : "70%", // Adjust this width as needed for larger margins
              maxWidth: "800px", // Limits the maximum width for better readability on large screens
              color: "#333333",
              fontSize: isSmallScreen
                ? "clamp(16px, 2.5vh, 20px)"
                : "clamp(20px, 3.1vh, 50px)",
              fontWeight: "bold",
              marginTop: isSmallScreen ? "-60px" : "-90px",
              flexWrap: isSmallScreen ? "wrap" : "nowrap",
              gap: isSmallScreen ? "15px" : "0",
            }}
          >
            <div
              onClick={() => setSelectedProduct("stocksAndCrypto")}
              style={{
                cursor: "pointer",
                color:
                  selectedProduct == "stocksAndCrypto" ? "#447E26" : "#222222",
              }}
            >
              Stocks And Crypto
            </div>
            <div
              onClick={() => setSelectedProduct("wallet")}
              style={{
                cursor: "pointer",
                color: selectedProduct == "wallet" ? "#447E26" : "#222222",
              }}
            >
              Wallet
            </div>
            <div
              onClick={() => setSelectedProduct("earn")}
              style={{
                cursor: "pointer",
                color: selectedProduct == "earn" ? "#447E26" : "#222222",
              }}
            >
              Earn
            </div>
            <div
              onClick={() => setSelectedProduct("send")}
              style={{
                cursor: "pointer",
                color: selectedProduct == "send" ? "#447E26" : "#222222",
              }}
            >
              Send
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: isSmallScreen ? "column" : "row",
            marginTop: isSmallScreen ? "20px" : "0",
          }}
        >
          <img
            src={getImageSrc()}
            style={{ height: isSmallScreen ? "30vh" : "50vh", width: "auto" }}
          ></img>

          {selectedProduct == "wallet" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: isSmallScreen ? "auto" : "400px",
                maxWidth: isSmallScreen ? "90vw" : "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: isSmallScreen ? "center" : "left",
                height: isSmallScreen ? "auto" : "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: isSmallScreen
                    ? "clamp(24px, 4vh, 30px)"
                    : "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: isSmallScreen ? "center" : "left",
                }}
              >
                Hold US Dollars and Euros Securely With No Bank Account Needed
              </div>

              <img
                src={getPoweredByImageSrc()}
                style={{
                  height: "40px",
                  width: "260px",
                  margin: isSmallScreen ? "20px auto" : "0",
                }}
              ></img>

              <a
                href="https://www.circle.com/usdc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: isSmallScreen ? "center" : "left",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: isSmallScreen ? "18px" : "22px",
                }}
              >
                <div style={{ textAlign: isSmallScreen ? "center" : "left" }}>
                  Learn more about USDC and stablecoins
                </div>
              </a>
            </div>
          )}

          {selectedProduct == "earn" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: isSmallScreen ? "auto" : "400px",
                maxWidth: isSmallScreen ? "90vw" : "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: isSmallScreen ? "center" : "left",
                height: isSmallScreen ? "auto" : "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: isSmallScreen
                    ? "clamp(24px, 4vh, 30px)"
                    : "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: isSmallScreen ? "center" : "left",
                }}
              >
                Hold US Treasury Bonds and Earn 5.1% APY On Your US Dollars
              </div>
              <img
                src={getPoweredByImageSrc()}
                style={{
                  height: "40px",
                  width: "260px",
                  margin: isSmallScreen ? "20px auto" : "0",
                }}
              ></img>
              <a
                href="https://ondo.finance/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: isSmallScreen ? "center" : "left",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: isSmallScreen ? "18px" : "22px",
                }}
              >
                <div style={{ textAlign: isSmallScreen ? "center" : "left" }}>
                  Learn more about USDY and yield coins
                </div>
              </a>
            </div>
          )}

          {selectedProduct == "send" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: isSmallScreen ? "auto" : "400px",
                maxWidth: isSmallScreen ? "90vw" : "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: isSmallScreen ? "center" : "left",
                height: isSmallScreen ? "auto" : "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: isSmallScreen
                    ? "clamp(24px, 4vh, 30px)"
                    : "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: isSmallScreen ? "center" : "left",
                }}
              >
                Send US Dollars and Euros Across the World Instantly For Free
              </div>
              <img
                src={getPoweredByImageSrc()}
                style={{
                  height: "40px",
                  width: "260px",
                  margin: isSmallScreen ? "20px auto" : "0",
                }}
              ></img>
              <a
                href="https://solana.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: isSmallScreen ? "center" : "left",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: isSmallScreen ? "18px" : "22px",
                }}
              >
                <div style={{ textAlign: isSmallScreen ? "center" : "left" }}>
                  Learn more about the Solana network
                </div>
              </a>
            </div>
          )}

          {selectedProduct == "stocksAndCrypto" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: isSmallScreen ? "auto" : "400px",
                maxWidth: isSmallScreen ? "90vw" : "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: isSmallScreen ? "center" : "left",
                height: isSmallScreen ? "auto" : "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: isSmallScreen
                    ? "clamp(24px, 4vh, 30px)"
                    : "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: isSmallScreen ? "center" : "left",
                }}
              >
                Buy Crypto And Stocks, Store Them Directly On Your Phone
              </div>
              <img
                src={getPoweredByImageSrc()}
                style={{
                  height: "40px",
                  width: "260px",
                  margin: isSmallScreen ? "20px auto" : "0",
                }}
              ></img>
              <a
                href="https://dinari.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: isSmallScreen ? "center" : "left",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: isSmallScreen ? "18px" : "22px",
                }}
              >
                <div style={{ textAlign: isSmallScreen ? "center" : "left" }}>
                  Learn more about Dinari and RWAs
                </div>
              </a>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "40px",
        }}
      >
        <div
          style={{
            fontSize: isSmallScreen ? "30px" : "40px",
            color: "#124C0A",
            fontWeight: "bold",
          }}
        >
          Customer Service
        </div>
        <div
          style={{
            fontSize: isSmallScreen ? "20px" : "25px",
            color: "#000000",
            textAlign: "center",
          }}
        >
          We're here to help you with any questions you might have.
        </div>
      </div>
      {sendMessageToggled ? (
        <>
          <div style={{ marginTop: "20px", background: "#ffffff" }}>
            <HomeContactForm language={lang} />
          </div>
        </>
      ) : (
        <div
          style={{
            fontSize: isSmallScreen ? "16px" : "20px",
            fontWeight: "bold",
            margin: "0 auto",
            marginTop: "65px",
            marginBottom: "50px",
            textAlign: "center",
            border: goToDashboardIsHovered
              ? "2px solid #222222"
              : "2px solid #222222",
            borderRadius: "20px",
            padding: isSmallScreen ? "10px" : "15px",
            cursor: "pointer",
            background: goToDashboardIsHovered ? "transparent" : "#222222",
            color: goToDashboardIsHovered ? "#222222" : "white",
            maxWidth: "420px",
          }}
          onMouseEnter={() => setgoToDashboardIsHovered(true)}
          onMouseLeave={() => setgoToDashboardIsHovered(false)}
          onClick={() => {
            setsendMessageToggled(true);
          }}
        >
          SEND US A MESSAGE
        </div>
      )}

      <div style={{ padding: "20px", backgroundColor: "#222222" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "40px",
          }}
        >
          <img src={Logo} style={{ width: "auto", height: "50px" }}></img>

          <div
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "20px",
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div
                onClick={() => navigate("/terms-of-service")}
                style={{
                  color: "#ffffff",
                  fontSize: isSmallScreen ? "20px" : "25px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Terms Of Service
              </div>
              <div
                onClick={() => navigate("/privacy-policy")}
                style={{
                  color: "#ffffff",
                  fontSize: isSmallScreen ? "20px" : "25px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Privacy Policy
              </div>
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: isSmallScreen ? "20px" : "25px",
                marginTop: isSmallScreen ? "20px" : "0",
              }}
            >
              ©️ Myfye Ltd. All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
