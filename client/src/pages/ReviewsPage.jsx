import { Navigate, useOutletContext } from 'react-router-dom';
import ReviewManager from '../components/ReviewManager';

function ReviewsPage() {
  const {
    employees,
    isAdmin,
    loadAdminData,
    performanceCycles,
    reviews,
    showNotice,
  } = useOutletContext();

  if (!isAdmin) {
    return <Navigate to="/feedback" replace />;
  }

  return (
    <ReviewManager
      employees={employees}
      performanceCycles={performanceCycles}
      reviews={reviews}
      onReload={loadAdminData}
      showNotice={showNotice}
    />
  );
}

export default ReviewsPage;
