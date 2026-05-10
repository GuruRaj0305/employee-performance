import { useCallback, useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { performanceApi } from '../api/performanceApi';
import EmployeeManager from '../components/EmployeeManager';

function EmployeesPage() {
  const {
    isAdmin,
    showNotice,
  } = useOutletContext();
  const [employees, setEmployees] = useState([]);

  const loadEmployees = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const employeesResult = await performanceApi.listEmployees();
      setEmployees(employeesResult.data || []);
    } catch (error) {
      showNotice(error.message, 'error');
    }
  }, [isAdmin, showNotice]);

  useEffect(() => {
    let isMounted = true;

    if (isAdmin) {
      performanceApi
        .listEmployees()
        .then((employeesResult) => {
          if (isMounted) {
            setEmployees(employeesResult.data || []);
          }
        })
        .catch((error) => {
          if (isMounted) {
            showNotice(error.message, 'error');
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isAdmin, showNotice]);

  if (!isAdmin) {
    return <Navigate to="/feedback" replace />;
  }

  return (
    <EmployeeManager
      employees={employees}
      onReload={loadEmployees}
      showNotice={showNotice}
    />
  );
}

export default EmployeesPage;
