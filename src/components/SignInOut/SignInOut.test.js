import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignInOut from './SignInOut';

describe('<SignInOut />', () => {
  test('it should mount', () => {
    render(<SignInOut />);
    
    const signInOut = screen.getByTestId('SignInOut');

    expect(signInOut).toBeInTheDocument();
  });
});