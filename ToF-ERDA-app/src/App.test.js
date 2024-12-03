import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ToF-ERDA Metadata Generator text', () => {
  render(<App />);
  const linkElement = screen.getByText(/ToF-ERDA Metadata Generator/i);
  expect(linkElement).toBeInTheDocument();
});