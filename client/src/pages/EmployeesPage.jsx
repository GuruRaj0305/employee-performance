import { Navigate, useOutletContext } from 'react-router-dom';
import EmployeeManager from '../components/EmployeeManager';

function EmployeesPage() {
  const {
    employees,
    isAdmin,
    loadAdminData,
    showNotice,
  } = useOutletContext();

  if (!isAdmin) {
    return <Navigate to="/feedback" replace />;
  }

  return (
    <EmployeeManager
      employees={employees}
      onReload={loadAdminData}
      showNotice={showNotice}
    />
  );
}

export default EmployeesPage;
