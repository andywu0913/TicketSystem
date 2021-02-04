import { useHistory, useLocation } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import { saveAccessToken, saveExpiration, saveRefreshToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function GitHub() {
  swal.showLoading();

  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const error = query.get('error');
  if (error) {
    swal.fire({ icon: 'error', title: 'Error', text: 'Fail to sign in with GitHub.' })
      .then(() => history.replace('/user/signin'));
    return null;
  }

  const code = query.get('code');
  axios.post(`${BackendURL}/user/login/github`, { code })
    .then((response) => {
      const { data } = response.data;
      saveAccessToken(data.access_token);
      saveRefreshToken(data.refresh_token);
      saveExpiration(data.expires_in);

      swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
        .then(() => window.location.replace('/'));
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { error_msg: message = '' } = error.response.data;
        swal.fire({ icon: 'error', title: 'Error', text: message })
          .then(() => history.replace('/user/signin'));
        return;
      }
      swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
}
