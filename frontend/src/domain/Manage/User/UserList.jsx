import React from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';

import moment from 'moment';
import PropTypes from 'prop-types';

import { getUserId } from 'SRC/utils/jwt';

function UserList(props) {
  const { users, updateUser } = props;
  const selfUserId = getUserId();

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
        {users.map((user) => {
          const lastLoginTime = moment(user.last_login_time).format('lll');
          return (
            <tr key={user.id}>
              <td className="align-middle text-nowrap">{user.id}</td>
              <td className="align-middle text-nowrap">{user.uname}</td>
              <td className="align-middle text-nowrap">{user.name}</td>
              <td className="align-middle text-nowrap">{user.email}</td>
              <td className="align-middle text-nowrap">{user.rname}</td>
              <td className="align-middle text-nowrap">{lastLoginTime}</td>
              <td className="align-middle text-nowrap">
                {selfUserId !== user.id
                  ? (
                    <Button variant="primary" className="text-nowrap" onClick={() => updateUser(user)}>
                      <PencilSquare size="1.25rem" />&nbsp;Edit
                    </Button>
                  )
                  : (
                    <OverlayTrigger overlay={<Tooltip>Update your own profile from the user profile page.</Tooltip>}>
                      <span>
                        <Button variant="primary" className="text-nowrap" style={{ pointerEvents: 'none' }} disabled>
                          <PencilSquare size="1.25rem" />&nbsp;Edit
                        </Button>
                      </span>
                    </OverlayTrigger>
                  )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    uname: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    rname: PropTypes.string,
    last_login_time: PropTypes.string,
  })),
  updateUser: PropTypes.func,
};

UserList.defaultProps = {
  users: [],
  updateUser: () => {},
};

export default UserList;
