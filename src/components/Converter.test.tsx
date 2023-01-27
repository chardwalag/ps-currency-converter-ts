import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import Converter, { CURRENCY_NOT_SAME, AMOUNT_GREATER_THAN_ZERO } from './Converter'
import { INVALID_STRUCTURE } from '../utils/parseInput'
import * as api from '../utils/api';


// api mocks
api.convertCurrency = () => new Promise( resolve => resolve( 1 ))

const symbols = {
  "AUD": "Australian Dollar",
  "USD": "United States Dollar"    
}

test( 'displays an input and a button', () => {
  render(<Converter symbols={ symbols } saveConversion={() => {}}/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  expect( input ).toBeInTheDocument()
  expect( search ).toBeInTheDocument()
})

test( 'shows an `invalid input structure` error when an invalid input is submitted', async () => {
  render(<Converter symbols={ symbols } saveConversion={() => {}}/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  user.click( input )
  user.keyboard( '1_string_param_only' )
  await act( async () => user.click( search ))
  const error1 = screen.getByText( INVALID_STRUCTURE )
  expect( error1 ).toBeInTheDocument()

  user.click( input )
  user.keyboard( '2 strings_param_only' )
  await act( async () => user.click( search ))
  const error2 = screen.getByText( INVALID_STRUCTURE )
  expect( error2 ).toBeInTheDocument()

  user.click( input )
  user.keyboard( '3 string params_only' )
  await act( async () => user.click( search ))
  const error3 = screen.getByText( INVALID_STRUCTURE )
  expect( error3 ).toBeInTheDocument()

  user.click( input )
  user.keyboard( 'first param not number' )
  await act( async () => user.click( search ))
  const error4 = screen.getByText( INVALID_STRUCTURE )
  expect( error4 ).toBeInTheDocument()

  user.click( input )
  user.keyboard( '4 many   spaces   inbetween' )
  await act( async () => user.click( search ))
  const error5 = screen.getByText( INVALID_STRUCTURE )
  expect( error5 ).toBeInTheDocument()

  user.click( input )
  user.keyboard( '4 3rd_param not TO' )
  await act( async () => user.click( search ))
  const error6 = screen.getByText( INVALID_STRUCTURE )
  expect( error6 ).toBeInTheDocument()
})

test( 'shows an error when an input submitted has the same currencies', async () => {
  render(<Converter symbols={ symbols } saveConversion={() => {}}/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )
  user.click( input )
  user.keyboard( '1 AUD to AUD' )
  await act( async () => user.click( search ))
  const error = screen.getByText( CURRENCY_NOT_SAME )

  expect( error ).toBeInTheDocument()
})

test( 'shows an error when an input submitted has 0 amount', async () => {
  render(<Converter symbols={ symbols } saveConversion={() => {}}/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )
  user.click( input )
  user.keyboard( '0 AUD to USD' )
  await act( async () => user.click( search ))
  const error = screen.getByText( AMOUNT_GREATER_THAN_ZERO )

  expect( error ).toBeInTheDocument()
})

test( 'shows conversion result when a valid input is submitted', async () => {
  render(<Converter symbols={ symbols } saveConversion={() => {}}/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )
  user.click( input )
  user.keyboard( '1 AUD to USD' )
  await act( async () => user.click( search ))
  const conversionInput = screen.getByText( /1.00 Australian Dollar equals/i ), conversionOutput = screen.getByText( /United States Dollar/i )

  expect( conversionInput ).toBeInTheDocument()
  expect( conversionOutput ).toBeInTheDocument()

  const swapButton = screen.getByAltText( 'swap' )
  expect( swapButton ).toBeInTheDocument()
})

test( 'swaps currencies in the current conversion', async () => {
  render(<Converter symbols={ symbols } saveConversion={() => {}}/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )
  user.click( input )
  user.keyboard( '1 AUD to USD' )
  await act( async () => user.click( search ));
  const conversionInput = screen.getByText( /1.00 Australian Dollar equals/i ), conversionOutput = screen.getByText( /United States Dollar/i )

  expect( conversionInput ).toBeInTheDocument()
  expect( conversionInput ).toHaveClass( 'base-currency' )
  expect( conversionOutput ).toBeInTheDocument()
  expect( conversionOutput ).toHaveClass( 'target-currency' )

  const swapButton = screen.getByAltText( 'swap' )
  expect( swapButton ).toBeInTheDocument()

  await act( async () => user.click( swapButton ))
  const conversionInput2 = screen.getByText( /1.00 United States Dollar equals/i ), conversionOutput2 = screen.getByText( /Australian Dollar/i )

  expect( input ).toHaveValue( '1 USD to AUD' )
  expect( conversionInput2 ).toBeInTheDocument()
  expect( conversionInput2 ).toHaveClass( 'base-currency' )
  expect( conversionOutput2 ).toBeInTheDocument()
  expect( conversionOutput2 ).toHaveClass( 'target-currency' )
})

test( 'calls the saveConversion callback props when there is a new input', async () => {
  const saveMock = jest.fn()
  render(<Converter symbols={ symbols } saveConversion={ saveMock }/>)

  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )
  user.click( input )
  user.keyboard( '1 AUD to USD' )
  await act( async () => user.click( search ));
  user.click( input )

  expect( saveMock ).toHaveBeenCalled()

  const result = saveMock.mock.calls[ 0 ][ 0 ].result
  expect( saveMock ).toHaveBeenCalledWith({ fromAmount: 1, fromCurrency: 'AUD', toCurrency: 'USD', result })
})
