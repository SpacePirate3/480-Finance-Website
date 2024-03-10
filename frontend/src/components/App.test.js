import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { getMock } from '../APIMock.test';
import { apiObject } from './HomePage/Utility';
import App from './App';




test("AXIOS mock adapter works 2: electric boogaloo", () => {
  let spy = jest.spyOn(apiObject, 'get');
  getMock();
  apiObject.get('http://localhost:8000/api/stock/chart/line/intraday/GOOGL/').then(function (response) {
      console.log(response.data);
    });
  expect(spy).toHaveBeenCalled();

});


window.matchMedia = jest.fn(() => ({ matches: false, addListener: jest.fn(), removeListener: jest.fn() }));
test('renders NVDA link', () => {
  let spy = jest.spyOn(apiObject, 'get');
  getMock();
  render(<BrowserRouter><App /></BrowserRouter>);
  const linkElement = screen.getByText(/META/i);
  expect(spy).toHaveBeenCalled();
  expect(linkElement).toBeInTheDocument();
});
