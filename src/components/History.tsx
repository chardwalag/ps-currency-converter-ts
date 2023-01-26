import React, { FC } from 'react';

import './History.css';
import closeIcon from '../svg/close.svg';
import { ConversionResult } from '../utils/type';


type ConversionHistory = {
  symbols: {[ key: string ]: string },
  history: ConversionResult[],
  clear: () => void,
  removeItem: ( idx: number ) => void
}

const History: FC<ConversionHistory> = ({ history, symbols, clear, removeItem }) => (
  <>
    <div className="history-header">
      <div className="label"><h3>Previous amounts</h3></div>
      <div className="clear">
        <button onClick={ clear }>CLEAR ALL</button>
      </div>
    </div>
    <div className="history">
      { history.map(({ fromAmount, fromCurrency, toCurrency, result }, idx ) => (
        <div className="previous-amount" key={ idx }>
          <div className="currency">
            <div>{`${ fromAmount.toFixed( 2 )} ${ symbols[ fromCurrency ]} equals`}</div>
            <div className="target-currency">{`${ result?.toFixed( 2 )} ${ symbols[ toCurrency ]}`}</div>
          </div>
          <div className="close">
            <img src={ closeIcon } alt="close" onClick={() => removeItem( idx )} />
          </div>
        </div>
      ))}
    </div>
  </>
);

export default History;
