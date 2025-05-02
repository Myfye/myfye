import { useState } from "react";
import NavTrigger from "./NavTrigger";
import { AnimatePresence, motion } from "motion/react";
import { X as XIcon, SignOut as SignOutIcon } from "@phosphor-icons/react";
import Button from "@/shared/components/ui/button/Button";
import { useSelector } from "react-redux";

import { css } from "@emotion/react";
import { usePrivy } from "@privy-io/react-auth";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
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

    const userEmail = email.substring(0, atIndex);
    const domain = email.substring(atIndex);

    // If username is long, truncate it
    if (userEmail.length > 8) {
      return `${userEmail.substring(0, 5)}...${domain}`;
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
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
              }}
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
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "46%",
                height: "100vh",
                backgroundColor: "var(--clr-white)",
                zIndex: 1001,
                padding: "var(--size-100)",
                boxShadow: "10px 0 30px rgba(0, 0, 0, .15)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "var(--size-400)",
                }}
              >
                <Button
                  iconOnly
                  onPress={closeMenu}
                  icon={XIcon}
                  color="transparent"
                  data-size="large"
                ></Button>
              </div>

              {/* Menu content goes here */}
              <div style={{ flex: 1 }}>
                {currentUserEmail && (
                  <p style={{ marginBottom: "var(--size-300)" }}>
                    {formatEmail(currentUserEmail)}
                  </p>
                )}
              </div>

              {/* Sign Out button at the bottom */}
              <div
                style={{
                  marginTop: "auto",
                  paddingBottom: "var(--size-400)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onPress={signOut}
                  color="accent"
                  variant="primary"
                  size="medium"
                  disabled={disableLogout}
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavMenu;
