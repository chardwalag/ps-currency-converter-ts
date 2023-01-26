import React, { useState, useEffect } from 'react';

import './App.css';

import Header from './components/Header';
import Converter from './components/Converter';
import History from './components/History';
import { convertCurrency, getSymbols } from './utils/api';


const App = () => {
  const [ symbols, setSymbols ] = useState({})

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
  }, [])

  return (
    <div className="app">
      <div className="app__content">
        <Header />
        <Converter symbols={symbols} />
        <History />
      </div>
    </div>
  );
};

export default App;
