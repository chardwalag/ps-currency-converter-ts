import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen, within } from '@testing-library/react'
import user from '@testing-library/user-event'
import App from './App'
import * as api from './utils/api';


// api mocks
api.convertCurrency = () => new Promise( resolve => resolve( 1 ))
api.getSymbols = () => new Promise( resolve => resolve({
  "AUD": "Australian Dollar",
  "USD": "United States Dollar"    
}))

test( 'renders the app with header, input and search elements', async () => {
  await act( async () => render(<App />))
  const header = screen.getByText( /Currency Converter/i ), input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  expect( header ).toBeInTheDocument()
  expect( input ).toBeInTheDocument()
  expect( search ).toBeInTheDocument()
})

test( 'converts a given currency to another', async () => {
  render(<App />)
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

test( 'stores previous conversion into the history list', async () => {
  render(<App />)
  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  user.click( input )
  user.keyboard( '1 AUD to USD' )
  await act( async () => user.click( search ))
  user.click( input )

  const historyLabel = screen.getByText( /Previous amounts/i ), button = screen.getByRole( 'button' ),
  inputEntries = screen.getAllByText( /Australian Dollar equals/i ), outputEntries = screen.getAllByText( /United States Dollar/i ), closeButtons = screen.getAllByAltText( 'close' )

  expect( historyLabel ).toBeInTheDocument()
  expect( button ).toBeInTheDocument()
  expect( button ).toHaveTextContent( 'CLEAR ALL' )
  expect( inputEntries ).toHaveLength( 1 )
  expect( outputEntries ).toHaveLength( 1 )
  expect( closeButtons ).toHaveLength( 1 )
  expect( inputEntries[ 0 ]).toBeInTheDocument()
  expect( outputEntries[ 0 ]).toBeInTheDocument()
  expect( closeButtons[ 0 ]).toBeInTheDocument()
})

test( 'clears all the conversions in the history list', async () => {
  render(<App />)
  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  user.click( input )
  user.keyboard( '1 AUD to USD' )
  await act( async () => user.click( search ))
  user.click( input )
  user.keyboard( '2 AUD to USD' )
  await act( async () => user.click( search ))
  user.click( input )

  const inputEntries = screen.getAllByText( /Australian Dollar equals/i ), outputEntries = screen.getAllByText( /United States Dollar/i ), closeButtons = screen.getAllByAltText( 'close' )
  expect( inputEntries ).toHaveLength( 2 )
  expect( outputEntries ).toHaveLength( 2 )
  expect( closeButtons ).toHaveLength( 2 )

  const clearAll = screen.getByRole( 'button' )
  user.click( clearAll )

  const components = screen.getByTestId( 'app_content' ).children
  expect( components ).toHaveLength( 2 ) // header and converter remains, history is removed from DOM
})

test( 'clears a previous conversion by pressing its close icon', async () => {
  render(<App />)
  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  user.click( input )
  user.keyboard( '1 AUD to USD' )
  await act( async () => user.click( search ))
  user.click( input )

  const closeButtons = screen.getAllByAltText( 'close' )
  user.click( closeButtons[ 0 ])

  const components = screen.getByTestId( 'app_content' ).children
  expect( components ).toHaveLength( 2 ) // header and converter remains, history is removed from DOM
})

test( 'creates pagination when previous conversions count reached more than 10', async () => {
  render(<App />)
  const input = screen.getByRole( 'textbox' ), search = screen.getByAltText( 'magnify' )

  for ( let i = 1; i <= 11; ++i ) {
    user.click( input )
    user.keyboard( `${ i } AUD to USD` )
    await act( async () => user.click( search ))
  }
  user.click( input )

  const components = screen.getByTestId( 'app_content' ).children
  expect( components ).toHaveLength( 4 ) // header, converter, history, and pagination
})
