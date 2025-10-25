import { css } from "@emotion/react";
import { Envelope } from "@phosphor-icons/react";
import Modal from "@/shared/components/ui/modal/Modal";

interface SupportModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const SupportModal = ({ isOpen, onOpenChange }: SupportModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Get support"
      height={300}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--size-300);
          padding: var(--size-500);
          text-align: center;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--size-200);
          `}
        >
          <Envelope size={48} color="#02302c" />
          <p
            css={css`
              font-size: var(--fs-large);
              color: #02302c;
              font-weight: 500;
            `}
          >
            Need help? We're here for you!
          </p>
        </div>
        <a
          href="mailto:eli@myfye.com"
          css={css`
            display: inline-flex;
            align-items: center;
            gap: var(--size-100);
            padding: var(--size-200) var(--size-300);
            background-color: #02302c;
            color: white;
            text-decoration: none;
            border-radius: var(--border-radius-small);
            font-size: var(--fs-medium);
            font-weight: 500;
            transition: background-color 0.2s ease;
            
            &:hover {
              background-color: #034a45;
            }
          `}
        >
          <Envelope size={20} />
          eli@myfye.com
        </a>
      </div>
    </Modal>
  );
};

export default SupportModal;
