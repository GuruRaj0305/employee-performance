import { Navigate, useOutletContext } from 'react-router-dom';
import FeedbackRequests from '../components/FeedbackRequests';

function FeedbackPage() {
  const { isAdmin, showNotice } = useOutletContext();

  if (isAdmin) {
    return <Navigate to="/employees" replace />;
  }

  return <FeedbackRequests showNotice={showNotice} />;
}

export default FeedbackPage;
