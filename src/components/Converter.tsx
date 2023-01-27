import React, { FC, useState, useRef } from 'react';

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

const CURRENCY_NOT_SAME = 'Currencies should not be the same',
AMOUNT_GREATER_THAN_ZERO = 'Amount should be greater than 0.'

const Converter: FC<Conversion> = ({ symbols, saveConversion }) => {
  const [ inputString, setInputString ] = useState( '' ),
  [ errorMessage, setErrorMessage ] = useState( '' ),
  [ conversion, setConversion ] = useState< ConversionResult | null >( null ),
  inputEl = useRef< HTMLInputElement >( null ),
  [ inputButtonIcon, setInputButtonIcon ] = useState< InputIcon >( InputIcon.MAGNIFY ),

  notSupported = ( currency: string ) => `Base '${ currency }' is not supported.`,

  cleanUp = () => {
    if ( errorMessage ) setErrorMessage( '' )
    if ( conversion ) {
      saveConversion( conversion )
      setConversion( null )
    }
  },

  handleInput = () => {
    if ( InputIcon.CLEAR === inputButtonIcon ) {
      setInputString( '' )
      inputEl.current?.focus()
      return
    }
    if ( !inputString ) return

    setInputButtonIcon( InputIcon.CLEAR )
    try {
      const { fromAmount, fromCurrency, toCurrency }: ConversionResult = parseInput( inputString )
      if ( !symbols[ fromCurrency ])
        setErrorMessage( notSupported( fromCurrency ))
      else if ( !symbols[ toCurrency ])
        setErrorMessage( notSupported( toCurrency ))
      else if ( fromCurrency === toCurrency )
        setErrorMessage( CURRENCY_NOT_SAME )
      else if ( 0 >= fromAmount )
        setErrorMessage( AMOUNT_GREATER_THAN_ZERO )
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
    if ( InputIcon.CLEAR === inputButtonIcon ) setInputButtonIcon( InputIcon.MAGNIFY )
    cleanUp()
  },

  handleInputUpdate = ( ev: React.FormEvent<HTMLInputElement> ) => setInputString( ev.currentTarget.value ),

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
            value={ inputString }
            ref={ inputEl }
            onChange={ handleInputUpdate }
            onFocus={ handleFocus }
          />
        </div>
        <div className="magnify">
          <img src={ InputIcon.MAGNIFY === inputButtonIcon ? magnifyIcon : closeIcon } alt="magnify" onClick={ handleInput }/>
        </div>
      </div>
      { errorMessage && <div className="error">{ errorMessage }</div>}
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
            <img src={ swapIcon } alt="swap" onClick={ handleSwap } />
          </div>
        </div>
      }
    </>
  );
}

export default Converter;
