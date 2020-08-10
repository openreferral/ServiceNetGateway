import React from 'react';
import { Translate } from 'react-jhipster';

const ButtonPill = ({ className = '', onClick = null, translate = '', children = null, style = {} }) => {
  if (children && children.type === 'button') {
    return React.cloneElement(children, { className: `button-pill ${className}` });
  } else {
    return (
      <div className={`button-pill ${className}`} onClick={onClick} style={style}>
        {translate ? (
          <b>
            <Translate contentKey={translate} />
          </b>
        ) : (
          children
        )}
      </div>
    );
  }
};

export default ButtonPill;
