import React from 'react';
import { Card, Col } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';

export default function DefaultLoadingPlaceholder(props) {
  const { nums } = props;
  const cards = Array.from(Array(nums).keys()).map((key) => (
    <Col xs={12} md={6} lg={4} className="mb-4" key={key}>
      <Card className="h-100">
        <ContentLoader width="100%" height="300">
          <rect x="0" y="0" rx="2" ry="2" width="100%" height="66%" />
          <rect x="2%" y="70%" rx="5" ry="5" width="96%" height="20" />
          <rect x="2%" y="80%" rx="5" ry="5" width="80%" height="20" />
          <rect x="2%" y="90%" rx="5" ry="5" width="40%" height="20" />
        </ContentLoader>
      </Card>
    </Col>
  ));
  return (
    <>{cards}</>
  );
}

DefaultLoadingPlaceholder.propTypes = {
  nums: PropTypes.number,
};

DefaultLoadingPlaceholder.defaultProps = {
  nums: 10,
};
