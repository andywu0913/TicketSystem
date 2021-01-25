import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';

export default function GitHub() {
  Swal.showLoading();

  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const error = query.get('error');
  if (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Fail to sign in with GitHub.' })
      .then(() => history.replace('/user/signin'));
  }

  const code = query.get('code');
  console.log(code);

  return null;
}
