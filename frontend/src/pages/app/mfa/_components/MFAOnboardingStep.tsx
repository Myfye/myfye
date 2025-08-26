import MFAOnboardingHeading from "./MFAOnboardingHeading";
import {
  FingerprintIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { css } from "@emotion/react";
import { AnimatePresence, motion } from "motion/react";

interface MFAOnboardingSectionProps {
  step: number;
  currentStep: number;
}

const getIcon = (step: number) => {
  switch (step) {
    case 0:
      return KeyIcon;
    case 1:
      return FingerprintIcon;
    case 2:
      return ShieldCheckIcon;
    default:
      throw new Error("Cannot find MFA Step");
  }
};

const getTitle = (step: number) => {
  switch (step) {
    case 0:
      return "Set your password";
    case 1:
      return "Create passkey";
    case 2:
      return "Enroll in MFA";
    default:
      throw new Error("Cannot find MFA Step");
  }
};

const getDescription = (step: number) => {
  switch (step) {
    case 0:
      return "Your recovery password helps you access your account if you lose your phone.";
    case 1:
      return "Your passkey is encrypted and adds an additional layer of security to your account.";
    case 2:
      return "Verifying with MFA keeps your wallet safe. Once complete, you'll have access to your wallet.";
    default:
      throw new Error("Cannot find MFA Step");
  }
};

const getInactiveMarginBlockStart = (step: number, currentStep: number) => {
  if (step === 0) return "var(--size-0)";
  if (currentStep === 2) return "var(--size-300)";
  if (currentStep === 1 && step === 2) return "var(--size-300)";
  if (step === 2) return "var(--size-300)";
  return "var(--size-300)";
};

const getActiveMarginBlockStart = (step: number, currentStep: number) => {
  if (step === 0) return "var(--size-0)";
  return "var(--size-300)";
};

const MFAOnboardingStep = ({
  step = 0,
  currentStep = 0,
}: MFAOnboardingSectionProps) => {
  const isActive = currentStep === step;
  const state = isActive
    ? "active"
    : currentStep > step
    ? "complete"
    : "inactive";
  return (
    <AnimatePresence>
      <motion.li
        animate={state}
        transition={{ type: "inertia", velocity: 2 }}
        variants={{
          inactive: {
            marginBlockStart: getInactiveMarginBlockStart(step, currentStep),
          },
          active: {
            marginBlockStart: getActiveMarginBlockStart(step, currentStep),
          },
          complete: {
            marginBlockStart: getInactiveMarginBlockStart(step, currentStep),
          },
        }}
      >
        <MFAOnboardingHeading
          icon={getIcon(step)}
          title={getTitle(step)}
          isActive={isActive}
        />
        {isActive && (
          <motion.span
            transition={{ duration: 0.75, ease: "easeOut" }}
            initial={{ display: "none", opacity: 0 }}
            animate={{ display: "inline-block", opacity: 1 }}
            exit={{ display: "none", opacity: 0 }}
            className="caption"
            css={css`
              display: inline-block;
              margin-block-start: var(--size-150);
              color: var(--clr-text-weaker);
              padding-block-end: var(--size-100);
              max-width: 35ch;
              overflow: hidden;
            `}
          >
            {getDescription(step)}
          </motion.span>
        )}
      </motion.li>
    </AnimatePresence>
  );
};

export default MFAOnboardingStep;
