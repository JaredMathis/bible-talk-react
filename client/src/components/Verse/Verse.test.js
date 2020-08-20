import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Verse from './Verse';

describe('<Verse />', () => {
  test('it should mount', () => {
    render(<Verse />);
    
    const verse = screen.getByTestId('Verse');

    expect(verse).toBeInTheDocument();
  });
});