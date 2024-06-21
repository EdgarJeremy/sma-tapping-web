import axios from 'axios'
import LoginPage from './pages/Login'
import { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import PanelPage from './pages/Panel';

const baseURL = 'https://hrplus.pt-sma.co.id';
const http = axios.create({ baseURL });


function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    http.post('/IGW/s/externalPermission/login', {
      username, password, appVer: '2.49.01'
    }).then((data) => {
      const token = data.data.data.token;
      const refreshToken = data.data.data.refreshToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      check();
    }).catch((e) => {
      console.log(e);
    })
  }

  const getAttendance = async (start_date, end_date) => {
    return await http.post('/IGW/s/mobile/getAttendanceHistory', {
      start_date,
      end_date
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  const renewToken = async (callback) => {
    http.post('/IGW/s/externalPermission/refreshToken', {
      refreshToken: localStorage.getItem('refreshToken')
    }).then((data) => {
      const token = data.data.data.token;
      const refreshToken = data.data.data.refreshToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      check();
    }).catch((e) => {
      setLoading(false);
      setLoggedIn(false);
      console.log(e);
    });
  }

  const check = () => {
    http.post('/IGW/s/user_profile/getUserProfile', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((d) => {
      setLoading(false);
      setLoggedIn(true);
      const p = d.data.data.profile[0];
      setProfile(p);
    }).catch((e) => {
      renewToken();
    });
  }

  useEffect(() => {
    check();
  }, []);

  return (
    <div>
      {!loading ? (
        !loggedIn ? <LoginPage login={login} /> : <PanelPage getAttendance={getAttendance} profile={profile} />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <ProgressSpinner />
        </div>
      )}
    </div>
  )
}

export default App
