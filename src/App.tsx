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
      })
    }

    const history = localStorage.getItem( 'history' )
    if ( history ) setHistory( JSON.parse( history ))
  }, [])

  const onConversion = ( conversion: ConversionResult ) => {

  }

  return (
    <div className="app">
      <div className="app__content">
        <Header />
        <Converter symbols={symbols} onConversion={onConversion} />
        { 0 < history.length && <History history={history} />}
      </div>
    </div>
  );
};

export default App;
