
import { ConversionResult } from './type'


type ParseInput = (input: string) => ConversionResult

export const INVALID_STRUCTURE = 'Invalid input structure'

export const parseInput: ParseInput = (input: string) => {
  const tokens = input.split( ' ' )
  if (
    4 !== tokens.length ||
    isNaN( parseFloat( tokens[ 0 ])) ||
    'to' !== tokens[ 2 ].toLowerCase() ||
    !tokens[ 1 ] ||
    !tokens[ 3 ]
  ) {
    throw new Error( INVALID_STRUCTURE );
  }

  return {
    fromAmount: parseFloat( tokens[ 0 ]),
    fromCurrency: tokens[ 1 ].toUpperCase(),
    toCurrency: tokens[ 3 ].toUpperCase(),
  };
};
