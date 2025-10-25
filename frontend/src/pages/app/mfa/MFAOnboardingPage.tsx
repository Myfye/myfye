import {
  useMfaEnrollment,
  useSetWalletRecovery,
  useLinkAccount,
} from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { MFAStatus } from "@/features/mfa/types/mfa.types";
import MFAOnboardingStepList from "./_components/MFAOnboardingStepList";
import MFAOnboardingStep from "./_components/MFAOnboardingStep";
import { setStatus } from "@/features/mfa/stores/mfaSlice";
import Page from "@/shared/components/layout/page/Page";
import myFyeLogo from "@/assets/logo/myfye_logo.svg";
import MFAOnboardingGradient from "./_components/MFAOnboardingGradient";
import { useEffect, useRef } from "react";
import { AnimationSequence, useAnimate } from "motion/react";
import { useAppSelector } from "@/redux/hooks";

const getCurrentStep = (status: MFAStatus) => {
  switch (status) {
    case "created_password":
      return 1;
    case "created_passkey":
      return 2;
    case "enrolled":
      return -1;
    default:
      return 0;
  }
};

const MFAOnboardingPage = () => {
  const { showMfaEnrollmentModal } = useMfaEnrollment();

  const { createWallet } = useCreateWallet({
    onSuccess: () => {
      setStatus("created_wallet");
    },
    onError: (error) => {
      console.error("Error creating wallet", error);
    },
  });
  const { setWalletRecovery } = useSetWalletRecovery({
    onSuccess: () => {
      setStatus("created_password");
    },
    onError: (error) => {
      console.error("Error setting up wallet recovery:", error);
    },
  });
  const { linkPasskey } = useLinkAccount({
    onSuccess: () => {
      setStatus("created_passkey");
    },
    onError: (error) => {
      console.error("Error creating passkey:", error);
    },
  });

  const status = useAppSelector((state) => state.mfa.status);

  const currentStep = getCurrentStep(status);

  const [ref, animate] = useAnimate();

  const mfaOnboardingListSectionRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const sequence: AnimationSequence = [
      [
        ".mfa-onboarding-gradient .loading-screen",
        { opacity: 0, display: "none", duration: 1 },
      ],
      [
        ".mfa-onboarding-gradient .gradients",
        {
          "--_inner-circle-position-y": "0",
          "--_inner-circle-inner-color": "rgba(5, 81, 34, 1)",
          "--_inner-circle-outer-color": "rgba(5, 81, 34, 0)",
        },
        {
          duration: 1,
          ease: "easeInOut",
          at: "-0.5",
        },
      ],
      [
        ".mfa-onboarding-gradient .gradients",
        {
          "--_outer-circle-position-y": "0",
          "--_outer-circle-inner-color": "rgba(17, 126, 59, 1)",
          "--_outer-circle-outer-color": "rgba(17, 126, 59, 0)",
          "--_mask-color": "rgb(0 0 0 / 0)",
          "--_background-color": "rgba(5, 81, 34, 0)",
        },
        {
          duration: 1,
          ease: "easeInOut",
          at: "-0.75",
        },
      ],
      [
        mfaOnboardingListSectionRef.current,
        {
          opacity: 1,
          visibility: "visible",
          y: 0,
        },
        { duration: 0.5, ease: "easeOut", at: "-0.5" },
      ],
    ];
    const initAnimation = async () => {
      await animate(sequence);
    };
    initAnimation();
  });

  return (
    <>
      <Page className="mfa-onboarding-page" color="var(--clr-white)">
        <div
          ref={ref}
          css={css`
            height: 100cqh;
            position: relative;
            isolation: isolate;
            overflow: hidden;
          `}
        >
          <MFAOnboardingGradient />
          <div
            ref={mfaOnboardingListSectionRef}
            css={css`
              display: flex;
              flex-direction: column;
              height: 100cqh;
              position: relative;
              z-index: 1;
              visibility: hidden;
              transform: translateY(20px);
              opacity: 0;
            `}
          >
            <section
              css={css`
                margin-block-start: auto;
                padding-inline: var(--size-400);
              `}
            >
              <img
                src={myFyeLogo}
                alt="MyFye"
                css={css`
                  width: 7rem;
                  height: auto;
                  margin-block-end: var(--size-500);
                `}
              />
              <MFAOnboardingStepList>
                <MFAOnboardingStep step={0} currentStep={currentStep} />
                <MFAOnboardingStep step={1} currentStep={currentStep} />
                <MFAOnboardingStep step={2} currentStep={currentStep} />
              </MFAOnboardingStepList>
            </section>
            <section
              css={css`
                margin-block-start: var(--size-600);
                padding-inline: var(--size-400);
                padding-block-end: var(--size-250);
              `}
            >
              {currentStep === 0 && (
                <Button
                  expand
                  onPress={async () => {
                    await createWallet();
                    await setWalletRecovery();
                  }}
                >
                  Set Password
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  expand
                  onPress={() => {
                    linkPasskey();
                  }}
                >
                  Create Passkey
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  expand
                  onPress={() => {
                    showMfaEnrollmentModal();
                  }}
                >
                  Setup MFA
                </Button>
              )}
            </section>
          </div>
        </div>
      </Page>
    </>
  );
};

export default MFAOnboardingPage;
