import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IBA Metadata Generator text', () => {
  render(<App />);
  const linkElement = screen.getByText(/IBA Metadata Generator/i);
  expect(linkElement).toBeInTheDocument();
});

