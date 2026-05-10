const reviewService = require("./review.service");

const sendError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
};

const listReviewSessions = async (req, res) => {
  try {
    const reviews = await reviewService.listReviewSessions(req.query.performanceCycleId);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return sendError(res, error);
  }
};

const listPerformanceCycles = async (req, res) => {
  try {
    const cycles = await reviewService.listPerformanceCycles();
    return res.status(200).json({ success: true, data: cycles });
  } catch (error) {
    return sendError(res, error);
  }
};

const createPerformanceCycle = async (req, res) => {
  try {
    const cycle = await reviewService.createPerformanceCycle(req.body);
    return res.status(201).json({
      success: true,
      message: "Performance cycle created successfully",
      data: cycle,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const updatePerformanceCycle = async (req, res) => {
  try {
    const cycle = await reviewService.updatePerformanceCycle(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Performance cycle updated successfully",
      data: cycle,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const createReviewSession = async (req, res) => {
  try {
    const review = await reviewService.createReviewSession(req.body);
    return res.status(201).json({
      success: true,
      message: "Review session created successfully",
      data: review,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const updateReviewSession = async (req, res) => {
  try {
    const review = await reviewService.updateReviewSession(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Review session updated successfully",
      data: review,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const assignReviewer = async (req, res) => {
  try {
    const assignment = await reviewService.assignReviewer(req.params.id, req.body);
    return res.status(201).json({
      success: true,
      message: "Employee assigned successfully",
      data: assignment,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const listFeedbackRequests = async (req, res) => {
  try {
    const requests = await reviewService.listFeedbackRequests(req.user.id);
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return sendError(res, error);
  }
};

const submitFeedback = async (req, res) => {
  try {
    const feedback = await reviewService.submitFeedback(req.params.assignmentId, req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const listReviewsForEmployee = async (req, res) => {
  try {
    const { userId, reviewSessionId } = req.params;
    const reviews = await reviewService.listReviewsForEmployee(userId, reviewSessionId);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  listPerformanceCycles,
  createPerformanceCycle,
  updatePerformanceCycle,
  listReviewSessions,
  createReviewSession,
  updateReviewSession,
  assignReviewer,
  listFeedbackRequests,
  submitFeedback,
  listReviewsForEmployee,
};
