import { css } from "@emotion/react";
import { useContext, useState } from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import NavItem from "./NavItem";
import Button from "@/shared/components/ui/button/Button";
import { QRCodeModalContext } from "../QRCodeModalContext";
import SupportModal from "./SupportModal";
import ContactModal from "./ContactModal";

const Header = () => {
  const { setModalOpen } = useContext(QRCodeModalContext);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  return (
    <header
      className="content-grid"
      css={css`
        position: absolute;
        inset: 0;
        margin: auto;
        top: var(--size-300);
        bottom: auto;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Logo />
        <div
          css={css`
            display: flex;
            align-items: center;
            margin-inline-start: auto;
            padding: var(--size-150);
            background-color: var(--clr-white);
            border-radius: var(--border-radius-pill);
            padding-inline-start: var(--size-300);
          `}
        >
          <Nav>
            <NavItem onClick={() => setSupportModalOpen(true)}>Support</NavItem>
            <NavItem onClick={() => setContactModalOpen(true)}>Contact</NavItem>
          </Nav>
          <div
            css={css`
              margin-inline-start: var(--size-500);
            `}
          >
            <Button onPress={() => setModalOpen(true)}>Download the app</Button>
          </div>
        </div>
      </div>
      <SupportModal 
        isOpen={supportModalOpen} 
        onOpenChange={setSupportModalOpen} 
      />
      <ContactModal 
        isOpen={contactModalOpen} 
        onOpenChange={setContactModalOpen} 
      />
    </header>
  );
};

export default Header;
