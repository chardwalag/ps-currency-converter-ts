import React, { useState, useEffect } from 'react';

import './App.css';

import Header from './components/Header';
import Converter from './components/Converter';
import History from './components/History';
import { getSymbols } from './utils/api';
import { ConversionResult } from './utils/type';


const App = () => {
  const [ symbols, setSymbols ] = useState({}),
  [ history, setHistory ] = useState<ConversionResult[]>([])

  useEffect(() => {
    const symbols = localStorage.getItem( 'symbols' )
    if ( symbols ) {
      setSymbols( JSON.parse( symbols ))
    }
    else {
      getSymbols().then( symbols => {
        localStorage.setItem( 'symbols', JSON.stringify( symbols ))
        setSymbols( symbols )
      }).catch( err => {
        if ( err instanceof Error )
          alert( err.message )
      })
    }

    const history = localStorage.getItem( 'history' )
    if ( history ) setHistory( JSON.parse( history ))
  }, [])

  const saveConversion = ( conversion: ConversionResult ) => {
    const conversions = [ conversion, ...history ]
    setHistory( conversions )
    localStorage.setItem( 'history', JSON.stringify( conversions ))
  }

  return (
    <div className="app">
      <div className="app__content">
        <Header />
        <Converter symbols={symbols} saveConversion={saveConversion} />
        { 0 < history.length && <History history={history} symbols={symbols} />}
      </div>
    </div>
  );
};

export default App;
