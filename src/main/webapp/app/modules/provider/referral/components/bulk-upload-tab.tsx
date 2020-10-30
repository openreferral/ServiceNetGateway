import React from 'react';
import { Row } from 'reactstrap';
import { Translate } from 'react-jhipster';

const BulkUploadTab = () => (
  <Row className="col-12 col-md-8 offset-md-2 my-5 h-100 content-container">
    <div className="w-100">
      <div className="content-title my-3 my-md-5">
        <Translate contentKey="referral.title.bulk_upload" />
      </div>
    </div>
  </Row>
);

export default BulkUploadTab;
