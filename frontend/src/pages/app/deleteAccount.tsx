import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import Button from '../../shared/components/ui/button/Button';
import { Trash, Warning, ArrowLeft } from '@phosphor-icons/react';
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../../env';
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast/headless";

const DeleteAccountPage = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, ready, authenticated, login } = usePrivy();


  const handleDeleteAccount = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsDeleting(true);
    try {
      // First, get the internal user ID from the database using the Privy user ID
      const getUserResponse = await fetch(`${MYFYE_BACKEND}/get_user_by_privy_id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ privyUserId: user.id }),
      });

      if (!getUserResponse.ok) {
        throw new Error("Failed to get user from database");
      }

      const userData = await getUserResponse.json();
      if (!userData || !userData.uid) {
        throw new Error("User not found in database");
      }

      const internalUserId = userData.uid;

      // Now delete the user using the internal user ID
      const deleteResponse = await fetch(`${MYFYE_BACKEND}/delete_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ user_id: internalUserId }),
      });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete user");
      }

      console.log('Account deleted successfully');
      
      // Redirect to login page after successful deletion
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error(`Error try logging in again`);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (isConfirming) {
      setIsConfirming(false);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const styles = {
    container: css`
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9f0 0%, var(--clr-primary) 100%);
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `,
    card: css`
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
    `,
    header: css`
      margin-bottom: 24px;
    `,
    title: css`
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    `,
    subtitle: css`
      font-size: 16px;
      color: #666;
      line-height: 1.5;
    `,
    warningSection: css`
      background: #fff3cd;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    `,
    warningText: css`
      color: #856404;
      font-size: 14px;
      line-height: 1.5;
      text-align: left;
    `,
    buttonGroup: css`
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    `,
    backButton: css`
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: white;
        transform: scale(1.05);
      }
    `,
    dangerButton: css`
      background: #dc3545 !important;
      color: white !important;
      border: none !important;
      
      &:hover {
        background: #c82333 !important;
      }
      
      &:disabled {
        background: #6c757d !important;
        cursor: not-allowed;
      }
    `,
    secondaryButton: css`
      background: #6c757d !important;
      color: white !important;
      border: none !important;
      
      &:hover {
        background: #5a6268 !important;
      }
    `
  };

  return (
    <div css={styles.container}>
      <button css={styles.backButton} onClick={handleCancel}>
        <ArrowLeft size={24} color="#666" />
      </button>
      
      <div css={styles.card}>
        <div css={styles.header}>
          <div css={styles.title}>
            {isConfirming ? 'Final Confirmation' : 'Delete Account'}
          </div>
          <div css={styles.subtitle}>
            {isConfirming 
              ? 'This action cannot be undone. Are you absolutely sure?'
              : 'This action will permanently dissacociate your data. For security purposes we will not delete your embedded wallet.'
            }
          </div>
        </div>

        <div css={styles.warningSection}>
          <Warning size={24} color="#856404" weight="fill" />
          <div css={styles.warningText}>
            <div>This will remove all of your personal data but not your passkey or financial data</div>
          </div>
        </div>

        <div css={styles.buttonGroup}>
          {!isConfirming ? (
            <>
              <Button
                expand
                size="large"
                onPress={handleDeleteAccount}
                color="danger"
                css={styles.dangerButton}
                icon={Trash}
              >
                Delete My Account
              </Button>
              <Button
                expand
                size="large"
                onPress={handleCancel}
                color="secondary"
                css={styles.secondaryButton}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                expand
                size="large"
                onPress={handleDeleteAccount}
                color="danger"
                css={styles.dangerButton}
                icon={Trash}
                isDisabled={isDeleting}
              >
                {isDeleting ? 'Deleting Account...' : 'Yes, Delete My Account'}
              </Button>
              <Button
                expand
                size="large"
                onPress={handleCancel}
                color="secondary"
                css={styles.secondaryButton}
                isDisabled={isDeleting}
              >
                No, Keep My Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;