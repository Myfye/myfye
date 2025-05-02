import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function InvestmentValue() {

    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);

    const currentValue: number = usdyBalance
  
    const [upBy, setUpBy] = useState(currentValue);
    const MINIMUM_VALUE = 0.001
  
    let upByPrecision = 9;
  
  
    useEffect(() => {

        setUpBy(usdyBalance*priceOfUSDYinUSDC);
    }, [usdyBalance, priceOfUSDYinUSDC]);

    if (currentValue >= 10) {
        upByPrecision = 8;
    }
    if (currentValue >= 100) {
        upByPrecision = 7;
    }
    if (currentValue >= 1000) {
        upByPrecision = 6;
    }
    if (currentValue >= 10000) {
      upByPrecision = 5;
  }
  
    useEffect(() => {
      const interval = setInterval(() => {
          setUpBy(prevUpBy => prevUpBy + (10 ** -upByPrecision));
      }, 240); // Updates every 200ms
  
      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(interval);
  }, [upByPrecision]);


    if (usdyBalance < MINIMUM_VALUE) {
        return(
        <div style={{textAlign: 'center'}}>
            0.00
        </div>
        )
    } else {
        return(
            <div style={{width: '220px'}}>
            {upBy.toFixed(upByPrecision).split('.')[0].toLocaleString() + '.' + upBy.toFixed(upByPrecision).split('.')[1]}
            </div>
        )
    }


}

export default InvestmentValue