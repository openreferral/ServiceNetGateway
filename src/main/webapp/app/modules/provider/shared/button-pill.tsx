import React from 'react';
import { Translate } from 'react-jhipster';

const ButtonPill = props => (
  <div className="pill button-pill" onClick={props.onClick}>
    <div className={`d-inline button-pill ${props.additionalClass}`}>
      <b>
        <Translate contentKey={props.translate} />
      </b>
    </div>
  </div>
);

export default ButtonPill;
