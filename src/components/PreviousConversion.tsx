import React from 'react';

import './PreviousConversion.css';
import close from '../svg/close.svg';


const PreviousConversion = () => (
  <>
    <div className="header">
      <div className="label"><h3>Previous amounts</h3></div>
      <div className="clear">
        <button>CLEAR ALL</button>
      </div>
    </div>
    <div className="history">
      <div className="previous-amount">
        <div className="currency">
            <div>1.00 Australian Dollar equals</div>
            <div className="target-currency">0.77 US Dollar</div>
        </div>
        <div className="close">
            <img src={close} alt="close"/>
          </div>
      </div>
      <div className="previous-amount">
        <div className="currency">
            <div>1.00 Australian Dollar equals</div>
            <div className="target-currency">79.63 Japan Yen</div>
        </div>
        <div className="close">
            <img src={close} alt="close"/>
          </div>
      </div>
      <div className="previous-amount">
        <div className="currency">
            <div>1.00 Australian Dollar equals</div>
            <div className="target-currency">0.64 Euro</div>
        </div>
        <div className="close">
            <img src={close} alt="close"/>
          </div>
      </div>
    </div>
  </>
);

export default PreviousConversion;
