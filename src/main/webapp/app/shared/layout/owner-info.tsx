import _ from 'lodash';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const OwnerInfo = props => {
  const { record, direction } = props;
  if (record) {
    if (record.owner && (record.owner.firstName || record.owner.lastName)) {
      const tooltipId = _.uniqueId('activity-owner-span-');
      return (
        <div className="d-inline-flex" id={tooltipId}>
          {`${_.get(record, 'owner.firstName', '')} ${_.get(record, 'owner.lastName', '')}`}
          <UncontrolledTooltip placement={direction} autohide={false} target={tooltipId}>
            {record.owner.email}
          </UncontrolledTooltip>
        </div>
      );
    } else {
      return <div className="d-inline-flex">{_.get(record, 'owner.email', '')}</div>;
    }
  } else {
    return null;
  }
};

export default OwnerInfo;
