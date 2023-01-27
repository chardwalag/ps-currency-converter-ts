import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import History from './History'


const symbols = {
  "AUD": "Australian Dollar",
  "USD": "United States Dollar"    
},

createMockHistory = n => Array( n ).fill( 0 ).map(( _, idx ) => ({ fromAmount: idx, fromCurrency: 'AUD', toCurrency: 'USD', result: idx }))

test( 'displays a label, a button, and a single entry in the history list', () => {
  const history = createMockHistory( 1 )
  render(<History history={ history } symbols={ symbols } clear={() => {}} removeItem={() => {}} />)
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

test( 'displays multiple entries in the history list', () => {
  const history = createMockHistory( 2 )
  render(<History history={ history } symbols={ symbols } clear={() => {}} removeItem={() => {}} />)
  const inputEntries = screen.getAllByText( /Australian Dollar equals/i ), outputEntries = screen.getAllByText( /United States Dollar/i ), closeButtons = screen.getAllByAltText( 'close' )

  expect( inputEntries.length ).toBeGreaterThan( 1 )
  expect( outputEntries.length ).toBeGreaterThan( 1 )
  expect( closeButtons.length ).toBeGreaterThan( 1 )

  history.forEach(( _, i ) => {
    expect( inputEntries[ i ]).toBeInTheDocument()
    expect( outputEntries[ i ]).toBeInTheDocument()
    expect( closeButtons[ i ]).toBeInTheDocument()
  })
})

test( 'calls the clear callback props when the clear all btton is pressed', () => {
  const clearMock = jest.fn()
  render(<History history={ createMockHistory( 1 )} symbols={ symbols } clear={ clearMock } removeItem={() => {}} />)
  const button = screen.getByRole( 'button' )
  user.click( button )

  expect( clearMock ).toHaveBeenCalled()
})

test( 'calls the removeItem callback props when an entry close button is pressed', () => {
  const removeMock = jest.fn()
  render(<History history={ createMockHistory( 1 )} symbols={ symbols } clear={() => {}} removeItem={ removeMock } />)
  const closeButton = screen.getByAltText( 'close' )
  user.click( closeButton )

  expect( removeMock ).toHaveBeenCalled()
})
