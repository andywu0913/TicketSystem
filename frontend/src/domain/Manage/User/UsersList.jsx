import React from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import { getUserId } from 'SRC/utils/jwt';

function UsersList(props) {
  const selfUserId = getUserId();
  const { data } = props;
  const users = data.map((user) => (
    <tr key={user.id}>
      <td className="align-middle text-nowrap">{user.id}</td>
      <td className="align-middle text-nowrap">{user.uname}</td>
      <td className="align-middle text-nowrap">{user.name}</td>
      <td className="align-middle text-nowrap">{user.email}</td>
      <td className="align-middle text-nowrap">{user.rname}</td>
      <td className="align-middle text-nowrap">{new Date(user.last_login_time).toLocaleString()}</td>
      <td className="align-middle text-nowrap">
        {selfUserId === user.id
          ? (
            <OverlayTrigger overlay={<Tooltip>Update your own profile from the user profile page.</Tooltip>}>
              <span>
                <Button variant="primary" className="text-nowrap" style={{ pointerEvents: 'none' }} disabled>
                  <PencilSquare size="1.25rem" />&nbsp;Edit
                </Button>
              </span>
            </OverlayTrigger>
          )
          : (
            <Link to="#" onClick={() => props.showUpdateUserModal(user)} className="text-reset">
              <Button variant="primary" className="text-nowrap">
                <PencilSquare size="1.25rem" />&nbsp;Edit
              </Button>
            </Link>
          )}
      </td>
    </tr>
  ));

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr className="text-center text-nowrap">
          <th>Uid</th>
          <th>Uname</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Last SignIn</th>
          <th>Action</th>
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
  showUpdateUserModal: PropTypes.func,
};

UsersList.defaultProps = {
  data: [],
  showUpdateUserModal: () => {},
};

export default UsersList;
