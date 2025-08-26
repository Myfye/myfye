import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";

import Button from "@/shared/components/ui/button/Button";
import { Check } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast/headless";
import {
  MYFYE_BACKEND,
  MYFYE_BACKEND_KEY,
  GOOGLE_MAPS_API_KEY,
} from "../../env";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../main";
import { logError } from "../../functions/LogError";
import { RootState } from "@/redux/store";
import { toggleModal } from "./kycSlice";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import Lottie from "lottie-react";
import { setCurrentUserKYCStatus } from "@/redux/userWalletData";

interface KYCOverlayProps {
  onBack?: unknown;
  selectedToken?: unknown;
  amount?: unknown;
  onCloseAll?: unknown;
  isOpen?: boolean;
  zIndex?: number;
}
const KYCOverlay = ({
  onBack,
  selectedToken,
  amount,
  onCloseAll,
  zIndex = 1000,
}: KYCOverlayProps) => {
  const isOpen = useSelector((state: RootState) => state.kyc.modal.isOpen);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const currentUserID = useSelector(
    (state: any) => state.userWalletData.currentUserID
  );

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!isOpen || !currentUserID) return;
      
      setLoading(true);
      
      try {
        const response = await fetch(`${MYFYE_BACKEND}/get_user_kyc_status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": MYFYE_BACKEND_KEY,
          },
          body: JSON.stringify({
            user_id: currentUserID,
          }),
        });

        if (!response.ok) {
          // Log detailed error information for debugging
          console.error('KYC Status Fetch Error Details:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries()),
            currentUserID,
            requestBody: { user_id: currentUserID },
            timestamp: new Date().toISOString()
          });
          
          // Try to get error response body if available
          try {
            const errorData = await response.text();
            console.error('KYC Status Error Response Body:', errorData);
          } catch (bodyError) {
            console.error('Could not read error response body:', bodyError);
          }
          
          throw new Error(`Failed to fetch KYC status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("KYC status response:", data);
        
        // Set the KYC status in local state
        setKycStatus(data.kyc_status || data.status || null);
        
        // If status is APPROVED, update Redux state
        if (data.kyc_status === 'APPROVED' || data.status === 'APPROVED') {
          dispatch(setCurrentUserKYCStatus('APPROVED'));
        }
        
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, [isOpen, currentUserID, dispatch]);

  const handleContinueButtonPressed = async () => {
    if (kycStatus === 'APPROVED') {
      // Close the overlay for approved status
      dispatch(toggleModal({ isOpen: false }));
    } else if (kycStatus === 'REJECTED') {
      // Handle retry logic for rejected status
      console.log("Retrying KYC verification...");
      // You can add retry logic here
    } else {
      // Handle new KYC flow initiation
      try {
        console.log("Initiating new KYC flow...");
        
        // Set KYC status to PENDING in Redux and local state
        dispatch(setCurrentUserKYCStatus('PENDING'));
        setKycStatus('PENDING');
        
        // Generate new KYC link
        const response = await fetch(`${MYFYE_BACKEND}/generate_sumsub_external_link`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": MYFYE_BACKEND_KEY,
          },
          body: JSON.stringify({
            userId: currentUserID,
            email: currentUserEmail,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate KYC link");
        }

        const data = await response.json();
        console.log("KYC link response:", data);
        
        // Open the KYC link in a new window/tab
        if (data.url) {
          window.open(data.url, '_blank', 'noopener,noreferrer');
        } else {
          throw new Error("No external link received");
        }
        
      } catch (error) {
        console.error("Error initiating KYC flow:", error);
        // Handle error appropriately - maybe show a toast notification
        toast.error("Failed to start KYC verification. Please try again.");
      }
    }
  };

  // Helper function to get button text based on status
  const getButtonText = () => {
    if (kycStatus === 'APPROVED') return 'Close';
    if (kycStatus === 'REJECTED') return 'Try Again';
    return 'Get Started';
  };

  // Helper function to check if button should be disabled
  const isButtonDisabled = () => {
    if (kycStatus === 'APPROVED') return false;
    if (kycStatus === 'REJECTED') return false;
    return !isChecked;
  };

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleModal({ isOpen }));
      }}
      title="Compliance"
      zIndex={zIndex}
    >
      {loading ? (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100cqh;
            padding: var(--size-400);
            gap: 2rem;
          `}
        >
          <div
            css={css`
              width: 120px;
              height: 120px;
            `}
          >
            <Lottie
              animationData={leafLoading}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      ) : kycStatus === 'PENDING' ? (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100cqh;
            padding: var(--size-400);
            gap: 2rem;
          `}
        >
          <div
            css={css`
              width: 120px;
              height: 120px;
            `}
          >
            <Lottie
              animationData={leafLoading}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div
            css={css`
              font-size: 1.2rem;
              color: var(--clr-text);
              text-align: center;
              font-weight: 500;
            `}
          >
            Verifying your identity...
          </div>
          <div
            css={css`
              font-size: 0.9rem;
              color: var(--clr-text-weaker);
              text-align: center;
            `}
          >
            We will send you an email to {currentUserEmail} when completed.
          </div>
        </div>
      ) : kycStatus === 'APPROVED' ? (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100cqh;
            padding: var(--size-400);
            gap: 2rem;
          `}
        >
          <div
            css={css`
              width: 120px;
              height: 120px;
            `}
          >
            <Lottie
              animationData={success}
              loop={false}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div
            css={css`
              font-size: 1.2rem;
              color: var(--clr-text);
              text-align: center;
              font-weight: 500;
            `}
          >
            Account Verified!
          </div>
          <div
            css={css`
              font-size: 0.9rem;
              color: var(--clr-text-weaker);
              text-align: center;
            `}
          >
            You can now transact on Myfye!
          </div>
          <div
            css={css`
              margin-top: auto;
              padding-top: var(--size-400);
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={handleContinueButtonPressed}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto;
            height: 100cqh;
            padding-block-end: var(--size-100);
            position: relative;
          `}
        >
          {kycStatus === 'REJECTED' && (
            <div
              css={css`
                background-color: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: var(--border-radius-medium);
                padding: var(--size-200);
                margin: var(--size-200);
                display: flex;
                align-items: center;
                gap: var(--size-150);
                min-height: 48px;
                max-height: 48px;
                flex-shrink: 0;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                z-index: 10;
              `}
            >
              <div
                css={css`
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background-color: #ef4444;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 12px;
                  font-weight: bold;
                  flex-shrink: 0;
                `}
              >
                !
              </div>
              <span
                css={css`
                  color: #dc2626;
                  font-size: 0.9rem;
                  font-weight: 500;
                  line-height: 1.2;
                  flex: 1;
                `}
              >
                We had some trouble verifying our KYC information
              </span>
            </div>
          )}
          <section
            css={css`
              margin-block-start: ${kycStatus === 'REJECTED' ? 'calc(var(--size-200) + 48px + var(--size-200))' : 'var(--size-100)'};
              padding-inline: var(--size-250);
            `}
          >
            <div
              css={css`
                padding: var(--size-100);
                border-radius: var(--border-radius-medium);
              `}
            >
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                `}
              >
                <h2
                  css={css`
                    color: var(--clr-text);
                  `}
                >
                  To continue,&nbsp;
                  <span style={{ color: "#006BCC", textDecoration: "underline" }}>
                    <a
                      href="https://www.investopedia.com/terms/k/knowyourclient.asp"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      regulations
                    </a>
                  </span>{" "}
                  require us to collect and verify your information
                </h2>
              </div>
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 1.5rem;
                  margin-top: 1.5rem;
                  margin-bottom: 1.5rem;
                `}
              >
                {/* Stepper Start */}
                <div
                  css={css`
                    display: grid;
                    grid-template-columns: 56px 1fr;
                    row-gap: 0;
                  `}
                >
                  {/* Step 1 */}
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    `}
                  >
                    <div
                      css={css`
                        width: 30px;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        background: var(--clr-primary);
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 1rem;
                        border: none;
                      `}
                    >
                      <Check size={18} weight="bold" />
                    </div>
                    <div
                      css={css`
                        flex: 1;
                        width: 4px;
                        background: var(--clr-primary);
                        min-height: 56px;
                        margin: 8px 0;
                      `}
                    ></div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div
                      css={css`
                        font-weight: 700;
                        color: var(--clr-neutral-400);
                        font-size: 1rem;
                      `}
                    >
                      Create your account
                    </div>
                    <div
                      css={css`
                        color: var(--clr-neutral-400);
                        font-size: 1rem;
                      `}
                    >
                      Add a password and secure your account
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    `}
                  >
                    <div
                      css={css`
                        width: 30px;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        background: transparent;
                        color: var(--clr-primary);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 1rem;
                        border: 3px solid var(--clr-primary);
                      `}
                    >
                      2
                    </div>
                    <div
                      css={css`
                        flex: 1;
                        width: 4px;
                        background: var(--clr-primary);
                        min-height: 56px;
                        margin: 8px 0;
                      `}
                    ></div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div
                      css={css`
                        font-weight: 700;
                        color: var(--clr-text);
                        font-size: 1rem;
                      `}
                    >
                      About you
                    </div>
                    <div
                      css={css`
                        color: var(--clr-text);
                        font-size: 1rem;
                      `}
                    >
                      Add personal details
                    </div>
                    <div
                      css={css`
                        color: var(--clr-primary);
                        font-size: 1rem;
                        font-weight: 500;
                        margin-top: 0.2rem;
                      `}
                    >
                      Approx. 2 min
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    `}
                  >
                    <div
                      css={css`
                        width: 30px;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        background: transparent;
                        color: var(--clr-neutral-400);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 1rem;
                        border: 3px solid var(--clr-neutral-400);
                      `}
                    >
                      3
                    </div>
                  </div>
                  <div>
                    <div
                      css={css`
                        font-weight: 700;
                        color: var(--clr-text);
                        font-size: 1rem;
                      `}
                    >
                      Verify your identity
                    </div>
                    <div
                      css={css`
                        color: var(--clr-text);
                        font-size: 1rem;
                      `}
                    >
                      Upload and verify your identity documents
                    </div>
                    <div
                      css={css`
                        color: var(--clr-primary);
                        font-size: 1rem;
                        font-weight: 500;
                        margin-top: 0rem;
                      `}
                    >
                      Approx. 5 min
                    </div>
                  </div>
                </div>
                {/* Stepper End */}
                {/* Checkbox Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 12,
                    marginBottom: 4,
                  }}
                >
                  <div
                    onClick={() => setIsChecked((prev) => !prev)}
                    style={{
                      width: 20,
                      height: 20,
                      border: "2px solid #666666",
                      background: "transparent",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      marginRight: 12,
                    }}
                  >
                    {isChecked ? (
                      <Check size={24} color="#666666" weight="bold" />
                    ) : (
                      <Check size={24} color="transparent" weight="bold" />
                    )}
                  </div>
                  <span style={{ color: "var(--clr-text)", fontSize: "1rem" }}>
                    I certify that I am 18 years of age or older, I agree to the{" "}
                    <span
                      style={{
                        color: "#006BCC",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/terms-of-service")}
                    >
                      User Agreement
                    </span>
                    .
                  </span>
                </div>
              </div>

              <div style={{ display: "flex" }}></div>
            </div>
          </section>

          <section
            css={css`
              margin-block-start: auto;
              padding-inline: var(--size-250);
              padding-block-end: var(--size-250);
              margin-top: 0;
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={handleContinueButtonPressed}
              isDisabled={isButtonDisabled()}
            >
              {getButtonText()}
            </Button>
          </section>
        </div>
      )}
    </Overlay>
  );
};

export default KYCOverlay;