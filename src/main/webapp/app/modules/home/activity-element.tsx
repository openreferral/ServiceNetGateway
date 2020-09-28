import './activity-element.scss';

import React from 'react';
import axios from 'axios';
import { Row, Col, Card, CardText, CardBody, CardTitle, CardGroup } from 'reactstrap';
import { Translate, translate, TextFormat } from 'react-jhipster';
import { APP_DATE_FORMAT, SYSTEM_ACCOUNTS } from 'app/config/constants';
import HideRecordButton from 'app/shared/layout/hide-record-button';
import { toast } from 'react-toastify';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';
import IconSpan from 'app/shared/layout/icon-span';
import OwnerInfo from 'app/shared/layout/owner-info';

const ActivityElement = props => {
  const maxConflicts = 3;
  const conflictsToDisplay = props.activity.conflicts.slice(0, maxConflicts);
  const areAllDisplayed = props.activity.conflicts.length <= maxConflicts;

  const hideActivity = event => {
    const matchIds = props.activity.organizationMatches;
    event.preventDefault();
    axios
      .post(`${SERVICENET_API_URL}/organization-matches/hideList`, matchIds)
      .then(() => {
        toast.success(translate('hiddenMatches.hiddenSuccessfully'));
        document.getElementById(props.activity.organizationId).style.display = 'none';
      })
      .catch(() => {
        toast.error(translate('hiddenMatches.hidingError'));
      });
  };

  const isSystemProviderRecord = props.activity.accountName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER;

  return (
    <Row className="activity-element" id={props.activity.organizationId}>
      <Col>
        <CardGroup>
          <Card className="activity-card">
            <CardBody className={`activity-card-body ${isSystemProviderRecord ? 'pl-1' : ' without-icon'}`}>
              <IconSpan containerClass={isSystemProviderRecord ? 'pl-0' : 'pl-2'} visible={isSystemProviderRecord}>
                <CardTitle className="activity-left-card-title">{props.activity.organizationName}</CardTitle>
                <CardText>
                  {isSystemProviderRecord ? <OwnerInfo owner={props.activity.owner} direction="right" /> : props.activity.accountName}
                </CardText>
              </IconSpan>
            </CardBody>
          </Card>
          <Card className="activity-right-card">
            <HideRecordButton id={`hide-${props.activity.organizationId}`} handleHide={hideActivity} />
            <CardBody>
              {conflictsToDisplay.map((conflict, i) => (
                <CardTitle className="activity-right-card-title" key={`activityCard${i}`}>
                  {conflict.partnerName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER ? (
                    <OwnerInfo owner={conflict.owner} direction="top" />
                  ) : (
                    conflict.partnerName
                  )}
                  <Translate
                    contentKey="serviceNetApp.activity.unresolved.conflictPlusZero"
                    interpolate={{ fieldName: conflict.fieldName }}
                  >
                    has a conflicting {conflict.fieldName}
                  </Translate>
                </CardTitle>
              ))}
              <div className="info-container">
                {areAllDisplayed ? (
                  <div />
                ) : (
                  <div className="multi-record-view-link">{`and ${props.activity.conflicts.length - maxConflicts} more...`}</div>
                )}
                {conflictsToDisplay.length > 0 && (
                  <CardText className="activity-right-card-info">
                    <Translate contentKey="serviceNetApp.activity.lastPartnerUpdate" />
                    <TextFormat value={props.activity.lastUpdated} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  </CardText>
                )}
              </div>
              {conflictsToDisplay.length === 0 && (
                <CardText className="activity-right-card-info">
                  <Translate contentKey="serviceNetApp.activity.noConflicts" />
                </CardText>
              )}
            </CardBody>
          </Card>
        </CardGroup>
      </Col>
    </Row>
  );
};

export default ActivityElement;
