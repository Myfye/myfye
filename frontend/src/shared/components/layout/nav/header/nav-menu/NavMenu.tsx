import { useEffect, useState } from "react";
import NavTrigger from "./NavTrigger";
import { AnimatePresence, motion } from "motion/react";
import {
  X as XIcon,
  SignOut as SignOutIcon,
  CaretRight,
  ShieldCheck,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import Button from "@/shared/components/ui/button/Button";
import { useSelector } from "react-redux";

import { css } from "@emotion/react";
import { usePrivy } from "@privy-io/react-auth";
import Header from "../Header";
import { RootState } from "@/redux/store";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUserEmail = useSelector(
    (state: RootState) => state.userWalletData.currentUserEmail
  );
  const walletData = useSelector((state: RootState) => state.userWalletData);
  const name =
    walletData.currentUserFirstName + walletData.currentUserLastName
      ? " " + walletData.currentUserLastName
      : "";

  const { ready, authenticated, logout } = usePrivy();
  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const signOut = () => {
    if (!disableLogout) {
      logout();
    }
  };

  // Function to truncate long email addresses
  const formatEmail = (email: string) => {
    if (!email) return "";

    // Extract username and domain parts
    const atIndex = email.indexOf("@");
    if (atIndex === -1) return email; // Not a valid email format

    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);

    // If username is longer than 16 characters, truncate it
    if (username.length > 18) {
      return `${username.substring(0, 5)}...${domain}`;
    }

    return email;
  };

  useEffect(() => {
    console.log(name, walletData.currentUserFirstName);
  }, [name, walletData]);
  return (
    <>
      <NavTrigger onPress={toggleMenu} />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible overlay that covers the entire screen for click handling */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              css={css`
                display: block;
                position: fixed;
                inset: 0;
                margin: auto;
                z-index: var(--z-index-nav);
                width: 100%;
                height: 100vh;
              `}
            />

            {/* Sliding menu panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.4,
                ease: [0.32, 0.72, 0, 1],
              }}
              css={css`
                display: flex;
                flex-direction: column;
                position: fixed;
                inset: 0;
                margin: auto;
                height: 100vh;
                background-color: var(--clr-surface);
                z-index: 9999;
                box-shadow: var(--box-shadow-nav);
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: var(--size-200);
                  height: 100%;
                  width: 100%;
                  max-width: var(--app-max-width);
                  margin-inline: auto;
                `}
              >
                <Header>
                  <Button
                    iconOnly
                    onPress={closeMenu}
                    icon={XIcon}
                    color="transparent"
                  />
                </Header>
                {/* Menu content goes here */}
                <main>
                  <button
                    css={css`
                      display: grid;
                      grid-template-columns: auto 1fr;
                      gap: var(--size-150);
                      align-items: center;
                      padding-inline: var(--size-250);
                      width: 100%;
                    `}
                  >
                    <div
                      css={css`
                        aspect-ratio: 1;
                        border-radius: var(--border-radius-circle);
                        width: 2.75rem;
                        background-color: var(--clr-surface-lowered);
                      `}
                    />
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      `}
                    >
                      {name && (
                        <p
                          css={css`
                            font-size: var(--fs-medium);
                            font-weight: var(--fw-active);
                            line-height: var(--line-height-tight);
                          `}
                        >
                          {name}
                        </p>
                      )}
                      {currentUserEmail && (
                        <p
                          css={css`
                            font-size: var(--fs-${name ? "small" : "medium"});
                            line-height: var(--line-height-tight);
                            font-weight: var(
                              --fw-${name ? "default" : "active"}
                            );
                          `}
                        >
                          {formatEmail(currentUserEmail)}
                        </p>
                      )}
                      <CaretRight size={20} color="var(--clr-text)" />
                    </div>
                  </button>
                </main>
                {/* Sign Out button at the bottom */}
                <footer
                  css={css`
                    display: flex;
                    justify-content: center;
                    margin-top: auto;
                    padding-bottom: var(--size-200);
                    padding-inline: var(--size-250);
                  `}
                >
                  <ButtonGroup direction="vertical" expand>
                    <ButtonGroupItem
                      variant="primary"
                      expand
                      icon={ShieldCheck}
                    >
                      Verify KYC
                    </ButtonGroupItem>
                    <ButtonGroupItem
                      onPress={signOut}
                      variant="secondary"
                      expand
                      isDisabled={disableLogout}
                    >
                      Sign out
                    </ButtonGroupItem>
                  </ButtonGroup>
                </footer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavMenu;
