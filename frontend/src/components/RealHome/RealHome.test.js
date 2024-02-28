import React from 'react';
import ReactDOM from 'react-dom';
import RealHome from './RealHome';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RealHome />, div);
  ReactDOM.unmountComponentAtNode(div);
});