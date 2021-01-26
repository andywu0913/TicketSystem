import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { saveAccessToken, saveRefreshToken, saveExpiration } from 'SRC/utils/jwt';

export default function GitHub() {
  Swal.showLoading();

  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const error = query.get('error');
  if (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Fail to sign in with GitHub.' })
      .then(() => history.replace('/user/signin'));
    return null;
  }

  const code = query.get('code');
  Axios.post('http://localhost:3000/api/user/login/github', { code })
    .then((response) => {
      const { data } = response.data;
      saveAccessToken(data.access_token);
      saveRefreshToken(data.refresh_token);
      saveExpiration(data.expires_in);

      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
        .then(() => window.location.replace('/'));
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { error_msg: message = '' } = error.response.data;
        Swal.fire({ icon: 'error', title: 'Error', text: message })
          .then(() => history.replace('/user/signin'));
        return;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });

  return null;
}
