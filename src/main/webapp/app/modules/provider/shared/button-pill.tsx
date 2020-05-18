import React from 'react';
import { Translate } from 'react-jhipster';

const ButtonPill = props => (
  <div className="pill button-pill" onClick={props.onClick}>
    <div className="d-inline button-pill">
      <Translate contentKey={props.translate} />
    </div>
  </div>
);

export default ButtonPill;
