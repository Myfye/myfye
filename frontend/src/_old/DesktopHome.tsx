import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import HomeContactForm from "../components/homePage/HomePageContactForm.tsx";
import Logo from "../assets/Logo.png";
import Logo2 from "../assets/MyFyeLogo2.png";
import MyFyeQRCode2 from "../assets/myfye_qr_code2.png";
import group136 from "../assets/group136.png";
import sendHomePage from "../assets/sendHomepage.png";
import earnHomePage from "../assets/earnHomepage.png";
import walletHomePage from "../assets/walletHomepage.png";
import cryptoStocksHomePage from "../assets/cryptoStocksHomepage.png";
import poweredByUSDC from "../assets/poweredByUSDC.png";
import poweredByOndo from "../assets/poweredByOndo.png";
import poweredBycbbtc from "../assets/poweredBycbbtc.png";
import poweredBySolana from "../assets/poweredBySolana.png";

function Home() {
  const navigate = useNavigate();
  const isSmallScreen = window.innerWidth <= 768;
  const [goToDashboardIsHovered, setgoToDashboardIsHovered] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("wallet");
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
        return poweredBycbbtc;
      default:
        return poweredByUSDC; // Optional: Add a default image if needed
    }
  };

  useEffect(() => {
    if (isSmallScreen) {
      navigate(`/app`);
    }
  }, [isSmallScreen]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-40px",
        }}
      >
        <img src={Logo2} style={{ width: "auto", height: "200px" }}></img>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          margin: "0 auto",
          maxWidth: "1500px",
          gap: "-40px",
          height: "calc(100lvh - 70px)",
          whiteSpace: "nowrap",
          marginTop: "-85px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "400px",
            maxWidth: "45vw",
            marginTop: "30px",
            marginBottom: "30px",
            justifyContent: "space-around",
            color: "#333333",
          }}
        >
          <div
            style={{
              color: "#447E26",
              fontSize: "clamp(40px, 7.1vh, 80px)",
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
              fontSize: "clamp(20px, 3.1vh, 50px)",
            }}
          >
            Hold <span style={{ fontWeight: "bold" }}>US Dollars</span>,{" "}
            <span style={{ fontWeight: "bold" }}>Euros</span>,
            <span style={{ fontWeight: "bold" }}> US Treasury Bonds</span>,
            <br />
            and <span style={{ fontWeight: "bold" }}>Bitcoin</span> directly on
            your phone.
          </div>

          <div
            style={{ color: "#333333", fontSize: "clamp(20px, 3.1vh, 50px)" }}
          >
            Send and receive US Dollars and Euros instantly from
            <br /> anywhere in the world{" "}
            <span style={{ fontWeight: "bold" }}> for free</span>.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "340px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "clamp(40px, 7.1vh, 80px)",
                marginRight: "15px",
                whiteSpace: "nowrap",
              }}
            >
              Get started today!
            </div>
            <img
              src={MyFyeQRCode2}
              alt="qrCode"
              style={{
                width: "150px",
                height: "150px",
                border: "2px solid #999999",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={group136} style={{ width: "auto", height: "600px" }} />
        </div>
        {/*
    <img src = {manWithPhone3} style={{
      height: 'calc(100lvh-200px)', 
      width: 'auto',
      marginLeft: '-10vw',
      zIndex: -1
      }}></img>
          */}
      </div>

      <div
        style={{
          height: "100lvh",
          marginTop: "10px",
          marginBottom: "100px",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ padding: "100px" }}>
          <div
            style={{
              color: "#447E26",
              fontSize: "clamp(40px, 7.1vh, 80px)",
              fontWeight: "bold",
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
              width: "70%", // Adjust this width as needed for larger margins
              maxWidth: "800px", // Limits the maximum width for better readability on large screens
              color: "#333333",
              fontSize: "clamp(20px, 3.1vh, 50px)",
              fontWeight: "bold",
              marginTop: "-90px",
            }}
          >
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
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img
            src={getImageSrc()}
            style={{ height: "50vh", width: "auto" }}
          ></img>

          {selectedProduct == "wallet" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "400px",
                maxWidth: "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: "left",
                height: "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: "left",
                }}
              >
                Hold US Dollars and Euros Securely With No Bank Account Needed
              </div>

              <img
                src={getPoweredByImageSrc()}
                style={{ height: "40px", width: "260px" }}
              ></img>

              <a
                href="https://www.circle.com/usdc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: "22px",
                }}
              >
                <div style={{ textAlign: "left" }}>
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
                minWidth: "400px",
                maxWidth: "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: "left",
                height: "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: "left",
                }}
              >
                Hold US Treasury Bonds and Earn 5.1% APY On Your US Dollars
              </div>
              <img
                src={getPoweredByImageSrc()}
                style={{ height: "40px", width: "260px" }}
              ></img>
              <a
                href="https://ondo.finance/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: "22px",
                }}
              >
                <div style={{ textAlign: "left" }}>
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
                minWidth: "400px",
                maxWidth: "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: "left",
                height: "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: "left",
                }}
              >
                Send US Dollars and Euros Across the World Instantly For Free
              </div>
              <img
                src={getPoweredByImageSrc()}
                style={{ height: "40px", width: "260px" }}
              ></img>
              <a
                href="https://solana.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: "22px",
                }}
              >
                <div style={{ textAlign: "left" }}>
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
                minWidth: "400px",
                maxWidth: "45vw",
                marginTop: "30px",
                marginBottom: "30px",
                justifyContent: "space-between",
                textAlign: "left",
                height: "45vh",
              }}
            >
              <div
                style={{
                  color: "#333333",
                  fontSize: "clamp(40px, 6.1vh, 80px)",
                  fontWeight: "bold",
                  maxWidth: "520px",
                  textAlign: "left",
                }}
              >
                Buy and Securely Store Bitcoin On Your Phone
              </div>
              <img
                src={getPoweredByImageSrc()}
                style={{ height: "40px", width: "260px" }}
              ></img>
              <a
                href="https://www.coinbase.com/cbbtc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0075EB",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                  textDecoration: "none", // Removes underline
                  display: "inline-block",
                  fontSize: "22px",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  Learn more about cbBTC and Coinbase
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
        <div style={{ fontSize: "40px", color: "#124C0A", fontWeight: "bold" }}>
          Customer Service
        </div>
        <div style={{ fontSize: "25px", color: "#000000" }}>
          We’re here to help you with any questions you might have.
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
            fontSize: "20px",
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
            style={{ paddingTop: "20px", color: "#ffffff", fontSize: "25px" }}
          >
            ©️ Myfye Ltd. All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
