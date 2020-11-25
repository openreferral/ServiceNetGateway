import React from 'react';
import { MOBILE_WIDTH_BREAKPOINT } from 'app/config/constants';
import { useMediaQuery } from 'react-responsive';

export default function mediaQueryWrapper(Component) {
  return function WrappedComponent(props) {
    const isMobile = useMediaQuery({ maxWidth: MOBILE_WIDTH_BREAKPOINT });
    return <Component {...props} isMobile={isMobile} />;
  };
}
