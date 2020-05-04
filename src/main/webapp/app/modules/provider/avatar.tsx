import './provider-home.scss';
import React from 'react';

export interface IAvatar {
  name: string;
  size: 'big' | 'small';
  mobile?: boolean;
}

export const Avatar: React.FC<IAvatar> = props => (
  <div className={`avatar-${props.mobile ? 'mobile-' : ''}${props.size}`}>{props.name}</div>
);
