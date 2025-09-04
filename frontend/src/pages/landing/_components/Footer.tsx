import { css } from "@emotion/react";
import { ReactNode } from "react";
import myfyeLogo from "@/assets/logo/myfye_logo_dark_green.svg";
import { InstagramLogoIcon, XLogoIcon } from "@phosphor-icons/react";

interface FooterProps {
  children?: ReactNode;
}
const Footer = ({ children }: FooterProps) => {
  return (
    <footer
      className="content-grid"
      css={css`
        background-color: #02302c;
      `}
    >
      <div
        className="footer-inner"
        css={css`
          display: grid;
          grid-auto-rows: auto;
          gap: var(--size-1000);
          border-radius: 1rem;
          padding-inline: var(--size-700);
          padding-block-start: var(--size-700);
          background-color: #dcfd8f;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
      >
        <section
          css={css`
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: var(--size-250);
            height: 12rem;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              grid-column: 1 / 3;
            `}
          >
            <img
              src={myfyeLogo}
              alt=""
              css={css`
                width: 8rem;
              `}
            />
            <nav
              css={css`
                margin-block-start: auto;
              `}
            >
              <ul
                css={css`
                  display: flex;
                  gap: var(--size-150);
                `}
              >
                <li>
                  <a href="https://instagram.com/myfyeapp">
                    <InstagramLogoIcon size={32} color="#02302c" />
                  </a>
                </li>
                <li>
                  <a href="https://x.com/myfyeapp">
                    <XLogoIcon size={32} color="#02302c" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <nav
            css={css`
              grid-column: 4 / 13;
            `}
          >
            <ul
              css={css`
                display: flex;
                flex-direction: column;
                color: #02302c;
                font-size: var(--fs-large);
                line-height: var(--line-height-tight);
                gap: var(--size-150);
                margin-block-start: var(--size-300);
              `}
            >
              <li>
                <a href="">About</a>
              </li>
              <li>
                <a>Support</a>
              </li>
              <li>
                <a>Contact</a>
              </li>
            </ul>
          </nav>
        </section>
        <section
          css={css`
            padding-block: var(--size-300);
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <p
              css={css`
                color: #02302c;
                font-size: var(--fs-medium);
                line-height: var(--line-height-tight);
              `}
            >
              © {new Date().getFullYear()} MyFye. All rights reserved.
            </p>
            <nav>
              <ul
                css={css`
                  display: flex;
                  color: #02302c;
                  font-size: var(--fs-medium);
                  line-height: var(--line-height-tight);
                  gap: var(--size-150);
                `}
              >
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms and conditions</a>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
