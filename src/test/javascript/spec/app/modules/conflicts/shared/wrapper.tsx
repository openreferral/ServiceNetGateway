import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './data';
import React from 'react';
import renderer from 'react-test-renderer';
import { loadIcons } from 'app/config/icon-loader';

export const wrapper = (mountedWrapper, component) => {
  if (!mountedWrapper) {
    loadIcons();
    const div = document.createElement('div');
    document.body.appendChild(div);
    return renderer.create(
      <Router>
        <Provider store={store}>
          {component}
        </Provider>
      </Router>
    );
  }
  return mountedWrapper;
};
