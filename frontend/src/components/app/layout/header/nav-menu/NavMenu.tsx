import { useEffect, useState } from "react";
import NavTrigger from "./NavTrigger";
import { AnimatePresence, motion } from "motion/react";
import {
  X as XIcon,
  SignOut as SignOutIcon,
  CaretRight,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button/Button";
import { useSelector } from "react-redux";

import { css } from "@emotion/react";
import { usePrivy } from "@privy-io/react-auth";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const walletData = useSelector((state: any) => state.userWalletData);

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
    if (username.length > 16) {
      return `${username.substring(0, 5)}...${domain}`;
    }

    return email;
  };

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
                height: 100svh;
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
                height: 100svh;
                background-color: var(--clr-surface);
                z-index: 9999;
                padding: var(--size-100);
                box-shadow: var(--box-shadow-nav);
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  width: 100%;
                  max-width: var(--app-max-width);
                  margin-inline: auto;
                `}
              >
                <header
                  css={css`
                    display: flex;
                    justify-content: flex-start;
                    margin-block-end: var(--size-400);
                    padding-inline: var(--size-100);
                  `}
                >
                  <Button
                    iconOnly
                    onPress={closeMenu}
                    icon={XIcon}
                    color="transparent"
                  ></Button>
                </header>
                {/* Menu content goes here */}
                <main>
                  <button
                    css={css`
                      display: grid;
                      grid-template-columns: auto 1fr;
                      gap: var(--size-200);
                      align-items: center;
                      padding-inline: var(--size-250);
                      width: 100%;
                    `}
                  >
                    <div
                      css={css`
                        aspect-ratio: 1;
                        border-radius: var(--border-radius-circle);
                        width: var(--size-600);
                        background-color: var(--clr-surface-lowered);
                      `}
                    ></div>
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      `}
                    >
                      {currentUserEmail && (
                        <p>{formatEmail(currentUserEmail)}</p>
                      )}
                      <CaretRight size={24} color="var(--clr-text)" />
                    </div>
                  </button>
                  <section
                    className="flow"
                    css={css`
                      display: flex;
                      flex-direction: column;
                      gap: var(--size-1000);
                      margin-block-start: var(--size-800);
                      padding-inline: var(--size-250);
                    `}
                  >
                    <section>
                      <p class="heading-large">Pay</p>
                    </section>
                    <section>
                      <p class="heading-large">Wallet</p>
                    </section>
                    <section>
                      <p class="heading-large">Earn</p>
                    </section>
                    <section>
                      <p class="heading-large">Crypto</p>
                    </section>
                  </section>
                </main>
                {/* Sign Out button at the bottom */}
                <footer
                  css={css`
                    display: flex;
                    justify-content: center;
                    margin-top: auto;
                    padding-bottom: var(--size-250);
                  `}
                >
                  <Button
                    onPress={signOut}
                    color="accent"
                    variant="neutral"
                    size="medium"
                    expand
                    isDisabled={disableLogout}
                  >
                    Sign Out
                  </Button>
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
