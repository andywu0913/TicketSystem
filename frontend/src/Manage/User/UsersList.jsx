import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';

import { getUserId } from 'SRC/utils/jwt';

function UsersList(props) {
  const selfUserId = getUserId();
  const { data } = props;
  const users = data.map((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.uname}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.rname}</td>
      <td>{new Date(user.last_login_time).toLocaleString()}</td>
      <td className="text-center">
        {selfUserId === user.id
          ? (
            <OverlayTrigger overlay={<Tooltip>Update your own profile from the user profile page.</Tooltip>}>
              <GearFill className="text-light" size="1.25rem" />
            </OverlayTrigger>
          )
          : (
            <Link to="#" onClick={() => props.showUserUpdateModal(user)} className="text-reset">
              <GearFill className="text-muted" size="1.25rem" />
            </Link>
          )}
      </td>
    </tr>
  ));

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr className="text-center">
          <th>Uid</th>
          <th>Uname</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Last SignIn</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
        {users}
      </tbody>
    </Table>
  );
}

UsersList.propTypes = {
  data: PropTypes.instanceOf(Array),
  showUserUpdateModal: PropTypes.func,
};

UsersList.defaultProps = {
  data: [],
  showUserUpdateModal: () => {},
};

export default UsersList;
