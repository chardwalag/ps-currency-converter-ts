import React, { FC, useState } from 'react';

import './Converter.css';
import swapIcon from '../svg/swap-vertical.svg';
import magnifyIcon from '../svg/magnify.svg';
import closeIcon from '../svg/close.svg';

import { convertCurrency } from '../utils/api';
import { parseInput } from '../utils/parseInput';
import { ConversionResult } from '../utils/type';


type Conversion = {
  symbols: {[ key: string ]: string },
  saveConversion: ( conversion: ConversionResult ) => void
}

enum InputIcon { MAGNIFY, CLEAR }

const Converter: FC<Conversion> = ({ symbols, saveConversion }) => {
  const [ inputString, setInputString ] = useState( '' ),
  [ errorMessage, setErrorMessage ] = useState( '' ),
  [ conversion, setConversion ] = useState< ConversionResult | null >( null ),
  [ inputButtonIcon, setInputButtonIcon ] = useState< InputIcon >( InputIcon.MAGNIFY ),

  handleInput = () => {
    if ( errorMessage ) setErrorMessage( '' )
    if ( conversion ) {
      saveConversion( conversion )
      setConversion( null )
    }
    if ( InputIcon.CLEAR === inputButtonIcon ) {
      setInputButtonIcon( InputIcon.MAGNIFY )
      setInputString( '' )
      return
    }

    if ( !inputString ) return
    setInputButtonIcon( InputIcon.CLEAR )
    try {
      const { fromAmount, fromCurrency, toCurrency }: ConversionResult = parseInput( inputString )
      if ( !symbols[ fromCurrency ])
        setErrorMessage( `Base '${ fromCurrency }' is not supported.` )
      else if ( !symbols[ toCurrency ])
        setErrorMessage( `Base '${ toCurrency }' is not supported.` )
      else if ( 0 >= fromAmount )
        setErrorMessage( 'Amount should be greater than 0.' )
      else {
        convertCurrency( fromCurrency, toCurrency, fromAmount ).then( result => {
          setConversion({ fromAmount, fromCurrency, toCurrency, result })
        }).catch( err => {
          if ( err instanceof Error )
            setErrorMessage( err.message )
          else if ( 'string' === typeof err )
            setErrorMessage( err )
        })
      }
    }
    catch ( err ) {
      if ( err instanceof Error ) setErrorMessage( err.message )
      else if ( 'string' === typeof err ) setErrorMessage( err )
    }
  },

  handleFocus = () => {
    if ( errorMessage ) setErrorMessage( '' )
    if ( InputIcon.CLEAR === inputButtonIcon ) setInputButtonIcon( InputIcon.MAGNIFY )
    if ( conversion ) {
      saveConversion( conversion )
      setConversion( null )
    }
  },

  handleInputUpdate = ( ev: React.FormEvent<HTMLInputElement> ) => {
    setInputString( ev.currentTarget.value )
  },

  handleSwap = () => {
    const { fromCurrency, toCurrency, fromAmount } = conversion!
    saveConversion( conversion! )
    setConversion( null )
    setInputString( `${ fromAmount } ${ toCurrency } to ${ fromCurrency }` )
    try {
      convertCurrency( toCurrency, fromCurrency, fromAmount ).then( result => {
        setConversion({ fromAmount, fromCurrency: toCurrency, toCurrency: fromCurrency, result })
      }).catch( err => {
        if ( err instanceof Error )
          setErrorMessage( err.message )
        else if ( 'string' === typeof err )
          setErrorMessage( err )
      })
    }
    catch ( err ) {
      if ( err instanceof Error ) setErrorMessage( err.message )
      else if ( 'string' === typeof err ) setErrorMessage( err )
    }
  }

  return (
    <>
      <div className="search">
        <div className="search-input">
          <input
            type="text"
            placeholder="e.g. 1 AUD to USD"
            value={inputString}
            onChange={handleInputUpdate}
            onFocus={handleFocus}
          />
        </div>
        <div className="magnify">
          <img src={InputIcon.MAGNIFY === inputButtonIcon ? magnifyIcon : closeIcon} alt="magnify" onClick={handleInput}/>
        </div>
      </div>
      { errorMessage && <div className="error">{errorMessage}</div>}
      { conversion &&
        <div className='conversion'>
          <div className="currency">
            <div className='base-currency'>
              { `${ conversion.fromAmount.toFixed( 2 )} ${ symbols[ conversion.fromCurrency ]} equals` }
            </div>
            <div className='target-currency'>
              { `${ conversion.result?.toFixed( 2 )} ${ symbols[ conversion.toCurrency ]}` }
            </div>
          </div>
          <div className="swap">
            <img src={swapIcon} alt="swap" onClick={handleSwap} />
          </div>
        </div>
      }
    </>
  );
}

export default Converter;
