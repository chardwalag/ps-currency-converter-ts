import React, { FC, useState, useEffect, useRef } from 'react';

import './Converter.css';
import swapIcon from '../svg/swap-vertical.svg';
import magnifyIcon from '../svg/magnify.svg';

import { convertCurrency } from '../utils/api';
import { parseInput } from '../utils/parseInput';
import { ConversionResult } from '../utils/type';


type Conversion = {
  symbols: {[ key: string ]: string },
  onConversion: ( conversion: ConversionResult ) => void
}

const Converter: FC<Conversion> = ({ symbols, onConversion }) => {
  const [ inputString, setInputString ] = useState( '' ),
  [ errorMessage, setErrorMessage ] = useState( '' ),
  [ conversion, setConversion ] = useState< ConversionResult | null >( null ),
  inputEl = useRef< HTMLInputElement >( null ),

  handleInput = () => {
    if ( !inputString ) return
    try {
      const { fromAmount, fromCurrency, toCurrency }: ConversionResult = parseInput( inputString )
      if ( !symbols[ fromCurrency ])
        setErrorMessage( `Base '${ fromCurrency }' is not supported.` )
      else if ( !symbols[ toCurrency ])
        setErrorMessage( `Base '${ toCurrency }' is not supported.` )
      else if ( 0 === fromAmount )
        setErrorMessage( 'Amount should be greater than 0.' )
    }
    catch ( err ) {
      if ( err instanceof Error )
        setErrorMessage( err.message )
    }
  },

  handleFocus = () => {
    setErrorMessage( '' )
  },

  handleInputUpdate = ( ev: React.FormEvent<HTMLInputElement> ) => {
    setInputString( ev.currentTarget.value )
  }

  return (
    <>
      <div className="search">
        <div className="search-input">
          <input
            type="text"
            placeholder="e.g. 1 AUD to USD"
            value={inputString}
            ref={inputEl}
            onChange={handleInputUpdate}
            onFocus={handleFocus}
          />
        </div>
        <div className="magnify">
          <img src={magnifyIcon} alt="magnify" onClick={handleInput}/>
        </div>
      </div>
      { errorMessage && <div className="error">{errorMessage}</div>}
      { conversion &&
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
      }
    </>
  );
}

export default Converter;
