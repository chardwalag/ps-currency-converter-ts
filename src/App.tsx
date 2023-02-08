import { useState, useEffect } from 'react';
import { Pagination, Spin } from 'antd';

import './App.css';

import Header from './components/Header';
import Converter from './components/Converter';
import History from './components/History';
import { getSymbols } from './utils/api';
import { ConversionResult } from './utils/type';


const ITEMS_PER_PAGE = 10

const App = () => {
  const [ symbols, setSymbols ] = useState<{[ key: string ]: string }>({}),
  [ history, setHistory ] = useState<ConversionResult[]>([]),
  [ page, setPage ] = useState( 1 ),
  [ fecthing, setFetching ] = useState( true ),

  saveHistory = ( conversions: ConversionResult[]) => {
    setHistory( conversions )
    localStorage.setItem( 'history', JSON.stringify( conversions ))
  },

  saveConversion = ( conversion: ConversionResult ) => saveHistory([ conversion, ...history ]),

  clearConversionHistory = () => saveHistory([]),

  removeConversion = ( idx: number ) => {
    const conversions = [ ...history ]
    conversions.splice( idx, 1 )
    saveHistory( conversions )
  },

  handlePage = ( page: number ) => setPage( page )

  useEffect(() => {
    const symbols = localStorage.getItem( 'symbols' )
    if ( symbols ) {
      setFetching( false )
      setSymbols( JSON.parse( symbols ))
    }
    else {
      getSymbols().then( symbols => {
        setFetching( false )
        localStorage.setItem( 'symbols', JSON.stringify( symbols ))
        setSymbols( symbols )
      }).catch( err => {
        setFetching( false )
        if ( err instanceof Error ) alert( err.message )
      })
    }

    const history = localStorage.getItem( 'history' )
    if ( history ) setHistory( JSON.parse( history ))
  }, [])

  return (
    <div className="app">
      { fecthing && <Spin size="large" />}
      { !fecthing &&
        <div className="app__content" data-testid="app_content">
          <Header />
          <Converter symbols={ symbols } saveConversion={ saveConversion } />
          { 0 < history.length &&
            <History
              history={ history.slice( ITEMS_PER_PAGE * ( page - 1 ), ITEMS_PER_PAGE * page )}
              symbols={ symbols }
              clear={ clearConversionHistory }
              removeItem={ removeConversion }
            />
          }
          { ITEMS_PER_PAGE < history.length &&
            <Pagination 
              className="pagination"
              total={ history.length }
              current={ page }
              showSizeChanger={ false }
              showTotal={ total => `${ total } items`}
              onChange={ handlePage }
            />
          }
        </div>
      }
    </div>
  );
};

export default App;
