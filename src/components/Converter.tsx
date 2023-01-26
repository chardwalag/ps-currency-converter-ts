import React, { FC } from 'react';

import './Converter.css';
import swapIcon from '../svg/swap-vertical.svg';
import magnify from '../svg/magnify.svg';

import { convertCurrency } from '../utils/api';


const Converter: FC<{ symbols: {}}> = ({ symbols }) => {

  // const onSearch = (value: string) => console.log(value);

  return (
    <>
      <div className="search">
        <div className="search-input">
          <input type="text" placeholder="e.g. 1 AUD to USD" />
        </div>
        <div className="magnify">
          <img src={magnify} alt="magnify"/>
        </div>
      </div>
      <div className="error">
        Invalid input structure
      </div>
      <div className='conversion'>
        <div className="currency">
          <div className='base-currency'>
            1.00 Australian Dollar equals
          </div>
          <div className='target-currency'>
            0.64 Euro
          </div>
        </div>
        <div className="swap">
          <img src={swapIcon} alt="swap"/>
        </div>
      </div>
    </>
  );
}

export default Converter;
