import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import { Translate } from 'react-jhipster';
import _ from 'lodash';

const IconSpan = ({ children, icon, color = '#109a26', visible, translate, containerClass = '', iconSize = '1em' }) => {
  const tooltipId = _.uniqueId('icon-span-');
  const iconRef = React.createRef() as React.LegacyRef<HTMLDivElement>;

  return visible ? (
    <div className={`d-flex icon-span ${containerClass}`}>
      <div className="mx-1" style={{ fontSize: iconSize }} ref={iconRef}>
        <FontAwesomeIcon id={`${tooltipId}`} icon={icon ? icon : 'user-friends'} color={color} />
      </div>
      <div style={{ width: '100%' }}>{children}</div>
      <UncontrolledTooltip placement="top" autohide={false} target={iconRef}>
        <Translate contentKey={translate ? translate : 'serviceNetApp.activity.serviceProviderOrgTooltip'} />
      </UncontrolledTooltip>
    </div>
  ) : (
    children
  );
};

export default IconSpan;
