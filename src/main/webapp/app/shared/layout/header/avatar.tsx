import './header.scss';
import React from 'react';

export interface IAvatar {
  name: string;
  size: 'big' | 'small';
  avatarBase64?: string;
  mobile?: boolean;
}

export const Avatar: React.FC<IAvatar> = props => {
  const className = `avatar-${props.mobile ? 'mobile-' : ''}${props.size}`;
  return props.avatarBase64 ? (
    <img alt="Avatar" className={className} src={props.avatarBase64} />
  ) : (
    <div className={className}>{props.name}</div>
  );
};
