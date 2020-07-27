import _ from 'lodash';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

export interface IOwnerInfoProps {
  record: any;
  direction: string;
}

export interface IOwnerInfoState {
  tooltipId: string;
}

class OwnerInfo extends React.Component<IOwnerInfoProps, IOwnerInfoState> {
  tooltipContainerRef: any;
  constructor(props) {
    super(props);
    this.tooltipContainerRef = React.createRef();
    this.state = {
      tooltipId: _.uniqueId('activity-owner-span-')
    };
  }

  checkElement = id => {
    const { record, direction } = this.props;
    if (_.get(this.tooltipContainerRef, 'current.id', null) === id) {
      return (
        <UncontrolledTooltip placement={direction} autohide={false} target={id}>
          {record.owner.email}
        </UncontrolledTooltip>
      );
    }
    return null;
  };

  render() {
    const { record } = this.props;
    const { tooltipId } = this.state;
    if (record) {
      if (record.owner && (record.owner.firstName || record.owner.lastName)) {
        return (
          <div className="d-inline-flex" id={tooltipId} ref={this.tooltipContainerRef}>
            {`${_.get(record, 'owner.firstName', '')} ${_.get(record, 'owner.lastName', '')}`}
            {this.checkElement(tooltipId)}
          </div>
        );
      } else {
        return <div className="d-inline-flex">{_.get(record, 'owner.email', '')}</div>;
      }
    } else {
      return null;
    }
  }
}

export default OwnerInfo;
