import React from 'react';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

const ErrorComp = () => {
  throw new Error('test');
};

describe('error-boundary-route component', () => {
  beforeEach(() => {
    // ignore console and jsdom errors
    jest.spyOn((window as any)._virtualConsole, 'emit').mockImplementation(() => false);
    jest.spyOn((window as any).console, 'error').mockImplementation(() => false);
  });

  // All tests will go here
  it('Should throw error when no component is provided', () => {
    expect(() => shallow(<ErrorBoundaryRoute />)).toThrow(Error);
  });

  it('Should render fallback component when an uncaught error is thrown from component', () => {
    const route = shallow(<ErrorBoundaryRoute component={ErrorComp} path="/" />);
    const renderedRoute = route.find(Route);
    expect(renderedRoute.length).toEqual(1);
    expect(renderedRoute.props().path).toEqual('/');
    expect(renderedRoute.props().render).toBeDefined();
    const renderFn: Function = renderedRoute.props().render;
    const comp = renderer.create(
      renderFn({
        location: '/'
      })
    ).root;
    expect(comp.findByProps({ className: 'error' }).children).toEqual(['An unexpected error has occurred.']);
  });
});
