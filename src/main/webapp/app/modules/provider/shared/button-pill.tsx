import React from 'react';
import { Translate } from 'react-jhipster';

const ButtonPill = props => (
  <div className="button-pill" onClick={props.onClick}>
    <div className={`d-inline ${props.additionalClass}`}>
      <b>
        <Translate contentKey={props.translate} />
      </b>
    </div>
  </div>
);

export default ButtonPill;
