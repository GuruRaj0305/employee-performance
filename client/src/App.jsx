import { useEffect, useState } from 'react';
import { authApi } from './api/authApi';
import AppSnackbar from './components/AppSnackbar';
import LoadingScreen from './components/LoadingScreen';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [notice, setNotice] = useState(null);

  const showNotice = (message, severity = 'success') => {
    setNotice({ message, severity });
  };

  useEffect(() => {
    let isMounted = true;

    authApi
      .profile()
      .then((result) => {
        if (isMounted) {
          setUser(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingProfile(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadingProfile) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AppRoutes user={user} setUser={setUser} showNotice={showNotice} />
      <AppSnackbar notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}

export default App;
