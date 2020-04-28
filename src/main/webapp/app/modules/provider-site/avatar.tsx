import './provider-site.scss';
import React from 'react';

export interface IAvatar {
  name: string;
  size: 'big' | 'small';
}

export const Avatar: React.FC<IAvatar> = props => <div className={`avatar-${props.size}`}>{props.name}</div>;
