import { useCallback, useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { performanceApi } from '../api/performanceApi';
import ReviewManager from '../components/ReviewManager';

function ReviewsPage() {
  const {
    isAdmin,
    showNotice,
  } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [performanceCycles, setPerformanceCycles] = useState([]);
  const [reviews, setReviews] = useState([]);

  const loadReviewData = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const [employeesResult, cyclesResult] = await Promise.all([
        performanceApi.listEmployees(),
        performanceApi.listPerformanceCycles(),
      ]);
      setEmployees(employeesResult.data || []);
      setPerformanceCycles(cyclesResult.data || []);
      setReviews((cyclesResult.data || []).flatMap((cycle) => cycle.reviewSessions || []));
    } catch (error) {
      showNotice(error.message, 'error');
    }
  }, [isAdmin, showNotice]);

  useEffect(() => {
    let isMounted = true;

    if (isAdmin) {
      Promise.all([
        performanceApi.listEmployees(),
        performanceApi.listPerformanceCycles(),
      ])
        .then(([employeesResult, cyclesResult]) => {
          if (isMounted) {
            setEmployees(employeesResult.data || []);
            setPerformanceCycles(cyclesResult.data || []);
            setReviews((cyclesResult.data || []).flatMap((cycle) => cycle.reviewSessions || []));
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
    <ReviewManager
      employees={employees}
      performanceCycles={performanceCycles}
      reviews={reviews}
      onReload={loadReviewData}
      showNotice={showNotice}
    />
  );
}

export default ReviewsPage;
