import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  test('contains routes container', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const root = container.querySelector('.min-h-screen');
    expect(root).toBeInTheDocument();
  });

  test('renders landing page content', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const text = screen.getByText(/MarketVision/i);
    expect(text).toBeInTheDocument();
  });
});
