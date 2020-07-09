import React from 'react';
import { Translate } from 'react-jhipster';

const ButtonPill = ({ additionalClass = '', onClick = () => {}, translate = '', children = null }) => (
  <div className="button-pill" onClick={onClick}>
    <div className={`d-inline ${additionalClass}`}>
      {translate ? (
        <b>
          <Translate contentKey={translate} />
        </b>
      ) : (
        children
      )}
    </div>
  </div>
);

export default ButtonPill;
