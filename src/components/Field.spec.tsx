import React from 'react';
import Field from './Field';
import { render } from '@testing-library/react';
import { mockSdk } from '../../test/mocks/mockSdk';

describe('Field component', () => {
  it('Component text exists', () => {
    const { getByTestId } = render(<Field sdk={mockSdk} />);

    expect(getByTestId('list-field', )).toBeInTheDocument();
  });
});
