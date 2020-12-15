import './referral-shared.scss';
import React from 'react';
import { Row } from 'reactstrap';
import { Translate } from 'react-jhipster';

const BulkUploadPage = () => (
  <div className="m-3">
    <Row className="col-12 col-md-8 offset-md-2 my-5 h-100 content-container justify-content-center referral">
      <div className="w-100">
        <div className="content-title my-3">
          <Translate contentKey="referral.title.bulk_upload" />
        </div>
      </div>
    </Row>
  </div>
);

export default BulkUploadPage;
