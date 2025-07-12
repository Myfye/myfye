import React from 'react';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { assetTicker, assetId, assetId2 } from '../../../functions/MintAddress';
import { RootState } from '@/redux/store';

interface Transaction {
  input_amount: number;
  input_mint: string;
  output_amount: number;
  output_mint: string;
  signature: string;
  timestamp: number;
  type: string;
}

interface ActivityListProps {
  transactions: Transaction[];
}

const ActivityList: React.FC<ActivityListProps> = ({ transactions }) => {
  const assets = useSelector((state: RootState) => state.assets.assets);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateUSDValue = (amount: number, mintAddress: string) => {
    console.log('calculateUSDValue called with:', { amount, mintAddress });
    
    if (!amount || !mintAddress) {
      console.log('Missing amount or mintAddress:', { amount, mintAddress });
      return 0;
    }
    
    const assetIdFromMint = assetId2(mintAddress);
    console.log('assetId result:', assetIdFromMint);
    
    if (!assetIdFromMint || !assets[assetIdFromMint]) {
      console.log('Asset not found:', { assetIdFromMint, hasAsset: !!assets[assetIdFromMint] });
      console.log('Available assets:', Object.keys(assets));
      return 0;
    }
    
    const asset = assets[assetIdFromMint];
    console.log('Found asset:', asset);
    console.log('Exchange rate USD:', asset.exchangeRateUSD);
    
    const result = amount * asset.exchangeRateUSD;
    console.log('Final calculation:', { amount, exchangeRateUSD: asset.exchangeRateUSD, result });
    
    return result;
  };

  const formatAmount = (amount: number, type: string) => {
    if (amount === null || amount === undefined) return '---';
    return `${amount.toFixed(6)}`;
  };

  const getTransactionIcon = (type: string) => {
    const baseIconStyle = css`
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #4C7A34;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      line-height: 1;
      flex-shrink: 0;
    `;

    switch (type) {
      case 'swap':
        return (
          <div css={baseIconStyle}>
            ⇄
          </div>
        );
      case 'deposit':
        return (
          <div css={baseIconStyle}>
            ↓
          </div>
        );
      case 'withdraw':
        return (
          <div css={baseIconStyle}>
            ↑
          </div>
        );
      case 'send':
        return (
          <div css={baseIconStyle}>
            →
          </div>
        );
      case 'request':
        return (
          <div css={baseIconStyle}>
            ←
          </div>
        );
      default:
        return (
          <div css={baseIconStyle}>
            ?
          </div>
        );
    }
  };

  const getTransactionTitle = (type: string, transaction?: Transaction) => {
    switch (type) {
      case 'swap':
        if (transaction && transaction.input_mint && transaction.output_mint) {
          // Truncate mint addresses to make them readable
          const inputMint = assetTicker(transaction.input_mint);
          const outputMint = assetTicker(transaction.output_mint);
          return `Swap ${inputMint} → ${outputMint}`;
        }
        return 'Swap';
      case 'deposit':
        if (transaction && transaction.input_mint) {
          const inputMint = assetTicker(transaction.input_mint);
          return `Deposit ${inputMint}`;
        }
        return 'Deposit';
      case 'withdraw':
        if (transaction && transaction.output_mint) {
          const outputMint = assetTicker(transaction.output_mint);
          return `Withdraw ${outputMint}`;
        }
        return 'Withdraw';
      case 'send':
        return 'Send';
      case 'request':
        return 'Request';
      default:
        return 'Transaction';
    }
  };

  const getTransactionDescription = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'swap':
        return `${formatAmount(transaction.input_amount, transaction.type)} → ${formatAmount(transaction.output_amount, transaction.type)}`;
      case 'deposit':
        return `+${formatAmount(transaction.input_amount, transaction.type)}`;
      case 'withdraw':
        return `-${formatAmount(transaction.output_amount, transaction.type)}`;
      case 'send':
        return `-${formatAmount(transaction.output_amount, transaction.type)}`;
      case 'request':
        return `+${formatAmount(transaction.input_amount, transaction.type)}`;
      default:
        return 'Unknown transaction';
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          color: var(--clr-text-secondary);
        `}
      >
        <h3>No transactions found</h3>
        <p>Your transaction history will appear here once you start using the app.</p>
      </div>
    );
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      `}
    >
      {transactions.map((transaction, index) => (
        <div
          key={`${transaction.signature}-${index}`}
          css={css`
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.2rem;
            background-color: var(--clr-surface-secondary);
            border-radius: 12px;
            border: 1px solid var(--clr-border);
            transition: background-color 0.2s ease;
            
            &:hover {
              background-color: var(--clr-surface-tertiary);
            }
          `}
        >
          {getTransactionIcon(transaction.type)}
          
          <div
            css={css`
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
            `}
          >
                         <div
               css={css`
                 font-weight: 600;
                 color: var(--clr-text-primary);
                 font-size: 1.1rem;
               `}
             >
               {getTransactionTitle(transaction.type, transaction)}
             </div>
            

            
                         <div
               css={css`
                 color: var(--clr-text-secondary);
                 opacity: 0.6;
                 font-size: 1rem;
               `}
             >
               {formatTimestamp(transaction.timestamp)}
             </div>
          </div>
          
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 0.25rem;
            `}
          >
                         <div
               css={css`
                 font-weight: 600;
                 color: var(--clr-text-primary);
                 font-size: 1.1rem;
               `}
             >
               ${calculateUSDValue(transaction.input_amount, transaction.input_mint).toLocaleString('en-US', {
                 minimumFractionDigits: 2,
                 maximumFractionDigits: 2
               })}
             </div>
             
             <a
               href={`https://solscan.io/tx/${transaction.signature}`}
               target="_blank"
               rel="noopener noreferrer"
               css={css`
                 color: #4C7A34;
                 border-radius: 4px;
                 text-decoration: none;
                 font-size: 0.7rem;
                 font-weight: 600;
                 letter-spacing: 0.05em;
                 opacity: 0.6;
                 transition: background-color 0.2s ease;
               `}
             >
               CONFIRMED
             </a>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
