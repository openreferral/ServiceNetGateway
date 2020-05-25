import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import { Translate } from 'react-jhipster';
import _ from 'lodash';

const IconSpan = ({ children, icon, color = '#109a26', visible, translate }) => {
  const tooltipId = _.uniqueId('icon-span-');

  return visible ? (
    <div className="d-flex icon-span">
      <FontAwesomeIcon id={`${tooltipId}`} icon={icon ? icon : 'user-friends'} color={color} />
      &nbsp;
      {children}
      <UncontrolledTooltip placement="top" autohide={false} target={`${tooltipId}`}>
        <Translate contentKey={translate ? translate : 'serviceNetApp.activity.serviceProviderOrgTooltip'} />
      </UncontrolledTooltip>
    </div>
  ) : (
    children
  );
};

export default IconSpan;
