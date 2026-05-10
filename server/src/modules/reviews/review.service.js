const { OthersReview, PerformanceCycle, ReviewOpenUser, ReviewSession, User, sequelize } = require("../../models/index.model");

const userSummary = ["id", "name", "emailId", "type", "active"];
const MAX_FEEDBACKS_PER_ASSIGNMENT = 5;
const reviewSummary = ["id", "performanceCycleId", "targetUserId", "name", "description", "active", "createdAt"];
const cycleSummary = ["id", "name", "description", "active", "createdAt"];

const cycleInclude = {
  model: PerformanceCycle,
  as: "performanceCycle",
  attributes: cycleSummary,
};

const getReviewInclude = () => [
  cycleInclude,
  {
    model: User,
    as: "targetUser",
    attributes: userSummary,
  },
  {
    model: ReviewOpenUser,
    as: "reviewOpenUsers",
    include: [
      { model: User, as: "user", attributes: userSummary },
      { model: User, as: "userRef", attributes: userSummary },
      { model: OthersReview, as: "othersReviews" },
    ],
  },
];

const listPerformanceCycles = () => {
  return PerformanceCycle.findAll({
    attributes: cycleSummary,
    include: [
      {
        model: ReviewSession,
        as: "reviewSessions",
        attributes: reviewSummary,
        include: getReviewInclude().filter((include) => include.as !== "performanceCycle"),
      },
    ],
    order: [
      ["createdAt", "DESC"],
      [{ model: ReviewSession, as: "reviewSessions" }, "createdAt", "DESC"],
    ],
  });
};

const createPerformanceCycle = async (data) => {
  return sequelize.transaction(async (transaction) => {
    const existingCycle = await PerformanceCycle.findOne({
      where: { name: data.name },
      transaction,
    });

    if (existingCycle) {
      const error = new Error("Performance cycle name already exists");
      error.statusCode = 409;
      throw error;
    }

    await PerformanceCycle.update({ active: false }, { where: { active: true }, transaction });
    await ReviewSession.update({ active: false }, { where: { active: true }, transaction });

    return PerformanceCycle.create(
      {
        name: data.name,
        description: data.description,
        active: true,
      },
      { transaction },
    );
  });
};

const updatePerformanceCycle = async (id, data) => {
  return sequelize.transaction(async (transaction) => {
    const cycle = await PerformanceCycle.findByPk(id, { transaction });

    if (!cycle) {
      const error = new Error("Performance cycle not found");
      error.statusCode = 404;
      throw error;
    }

    if (data.active === true && !cycle.active) {
      const error = new Error("Closed performance cycles cannot be reopened");
      error.statusCode = 400;
      throw error;
    }

    if (data.name && data.name !== cycle.name) {
      const existingCycle = await PerformanceCycle.findOne({
        where: { name: data.name },
        transaction,
      });

      if (existingCycle) {
        const error = new Error("Performance cycle name already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    await cycle.update(data, { transaction });

    if (data.active === false) {
      await ReviewSession.update({ active: false }, { where: { performanceCycleId: cycle.id }, transaction });
    }

    return cycle;
  });
};

const listReviewSessions = (performanceCycleId) => {
  const where = performanceCycleId ? { performanceCycleId } : {};

  return ReviewSession.findAll({
    attributes: reviewSummary,
    where,
    include: getReviewInclude(),
    order: [["createdAt", "DESC"]],
  });
};

const createReviewSession = async (data) => {
  return sequelize.transaction(async (transaction) => {
    const cycle = await findCycleOrThrow(data.performanceCycleId, transaction);

    if (!cycle.active) {
      const error = new Error("Cannot create review sessions in a closed performance cycle");
      error.statusCode = 400;
      throw error;
    }

    await findEmployeeOrThrow(data.targetUserId, transaction, "Target employee not found");

    const review = await ReviewSession.create(
      {
        performanceCycleId: data.performanceCycleId,
        targetUserId: data.targetUserId,
        name: data.name,
        description: data.description,
        active: data.active,
      },
      { transaction },
    );

    return ReviewSession.findByPk(review.id, {
      attributes: reviewSummary,
      include: getReviewInclude(),
      transaction,
    });
  });
};

const updateReviewSession = async (id, data) => {
  return sequelize.transaction(async (transaction) => {
    const review = await ReviewSession.findByPk(id, {
      include: [cycleInclude],
      transaction,
    });

    if (!review) {
      const error = new Error("Review session not found");
      error.statusCode = 404;
      throw error;
    }

    if (data.targetUserId) {
      await findEmployeeOrThrow(data.targetUserId, transaction, "Target employee not found");
    }

    if (!review.performanceCycle?.active) {
      const error = new Error("Closed performance cycles are view-only");
      error.statusCode = 400;
      throw error;
    }

    const cycle = data.performanceCycleId ? await findCycleOrThrow(data.performanceCycleId, transaction) : review.performanceCycle;

    if (!cycle.active) {
      const error = new Error("Closed performance cycles are view-only");
      error.statusCode = 400;
      throw error;
    }

    const updatePayload = {
      ...data,
    };

    await review.update(updatePayload, { transaction });

    return ReviewSession.findByPk(id, {
      attributes: reviewSummary,
      include: getReviewInclude(),
      transaction,
    });
  });
};

const assignReviewer = async (reviewSessionId, data) => {
  return sequelize.transaction(async (transaction) => {
    const review = await ReviewSession.findByPk(reviewSessionId, {
      include: [cycleInclude],
      transaction,
    });

    if (!review) {
      const error = new Error("Review session not found");
      error.statusCode = 404;
      throw error;
    }

    if (!review.active || !review.performanceCycle?.active) {
      const error = new Error("Closed reviews are view-only");
      error.statusCode = 400;
      throw error;
    }

    const reviewers = await getReviewerUsers(data, transaction);
    const reviewees = await getRevieweeUsers(review, data, transaction);
    const assignments = [];

    for (const reviewer of reviewers) {
      for (const reviewee of reviewees) {
        if (reviewer.id === reviewee.id) {
          const error = new Error("Reviewer and reviewee must be different employees");
          error.statusCode = 400;
          throw error;
        }

        const [assignment] = await ReviewOpenUser.findOrCreate({
          where: {
            reviewSessionId,
            userId: reviewer.id,
            userRefId: reviewee.id,
          },
          defaults: {
            reviewSessionId,
            userId: reviewer.id,
            userRefId: reviewee.id,
          },
          transaction,
        });

        assignments.push(assignment);
      }
    }

    if (!assignments.length) {
      const error = new Error("No valid reviewer assignments were created");
      error.statusCode = 400;
      throw error;
    }

    return ReviewOpenUser.findAll({
      where: {
        id: assignments.map((assignment) => assignment.id),
      },
      include: [
        { model: User, as: "user", attributes: userSummary },
        { model: User, as: "userRef", attributes: userSummary },
      ],
      transaction,
    });
  });
};

const listFeedbackRequests = async (reviewerId) => {
  const assignments = await ReviewOpenUser.findAll({
    where: { userId: reviewerId },
    include: [
      { model: User, as: "userRef", attributes: userSummary },
      {
        model: ReviewSession,
        as: "reviewSession",
        attributes: reviewSummary,
        include: [
          cycleInclude,
          {
            model: User,
            as: "targetUser",
            attributes: userSummary,
          },
        ],
      },
      {
        model: OthersReview,
        as: "othersReviews",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return assignments.map((assignment) => {
    const plain = assignment.get({ plain: true });
    const feedbackList = (plain.othersReviews || []).sort((first, second) => {
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
    const submittedFeedback = feedbackList[0] || null;
    const closed = !plain.reviewSession?.active || !plain.reviewSession?.performanceCycle?.active;

    return {
      id: plain.id,
      reviewSession: plain.reviewSession,
      reviewee: plain.userRef,
      submitted: Boolean(submittedFeedback),
      submittedCount: feedbackList.length,
      maxFeedbacks: MAX_FEEDBACKS_PER_ASSIGNMENT,
      canSubmitMore: !closed && feedbackList.length < MAX_FEEDBACKS_PER_ASSIGNMENT,
      closed,
      feedback: submittedFeedback,
      feedbackList,
    };
  });
};

const submitFeedback = async (assignmentId, reviewerId, data) => {
  return sequelize.transaction(async (transaction) => {
    const assignment = await ReviewOpenUser.findByPk(assignmentId, {
      include: [
        {
          model: ReviewSession,
          as: "reviewSession",
          include: [cycleInclude],
        },
      ],
      transaction,
    });

    if (!assignment || assignment.userId !== reviewerId) {
      const error = new Error("Feedback request not found");
      error.statusCode = 404;
      throw error;
    }

    if (!assignment.reviewSession?.active || !assignment.reviewSession?.performanceCycle?.active) {
      const error = new Error("Closed reviews are view-only");
      error.statusCode = 400;
      throw error;
    }

    const submittedCount = await OthersReview.count({
      where: {
        reviewOpenUserId: assignment.id,
        reviewerId,
      },
      transaction,
    });

    if (submittedCount >= MAX_FEEDBACKS_PER_ASSIGNMENT) {
      const error = new Error(`You can submit up to ${MAX_FEEDBACKS_PER_ASSIGNMENT} feedbacks for this review`);
      error.statusCode = 400;
      throw error;
    }

    return OthersReview.create(
      {
        reviewOpenUserId: assignment.id,
        reviewSessionId: assignment.reviewSessionId,
        reviewerId,
        revieweeId: assignment.userRefId,
        ...data,
      },
      { transaction },
    );
  });
};

const findCycleOrThrow = async (id, transaction) => {
  const cycle = await PerformanceCycle.findByPk(id, { transaction });

  if (!cycle) {
    const error = new Error("Performance cycle not found");
    error.statusCode = 404;
    throw error;
  }

  return cycle;
};

const findEmployeeOrThrow = async (userId, transaction, message = "Employee not found") => {
  const user = await User.findOne({
    where: {
      id: userId,
      type: "EMPLOYEE",
      active: true,
    },
    transaction,
  });

  if (!user) {
    const error = new Error(message);
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const getReviewerUsers = async (data, transaction) => {
  const reviewerIds = data.reviewerIds || [data.reviewerId];
  const reviewers = await User.findAll({
    where: {
      id: reviewerIds,
      type: "EMPLOYEE",
      active: true,
    },
    transaction,
  });

  if (reviewers.length !== reviewerIds.length) {
    const error = new Error("One or more reviewers were not found");
    error.statusCode = 404;
    throw error;
  }

  return reviewers;
};

const getRevieweeUsers = async (review, data, transaction) => {
  if (data.revieweeId) {
    return [await findEmployeeOrThrow(data.revieweeId, transaction, "Reviewee not found")];
  }

  return [await findEmployeeOrThrow(review.targetUserId, transaction, "Target employee not found")];
};

const listReviewsForEmployee = async (userId, reviewSessionId) => {
  return OthersReview.findAll({
    attributes: ["id", "title", "detail", "star", "createdAt", "updatedAt"],
    where: {
      revieweeId: userId,
      reviewSessionId,
    },
    include: [
      { model: User, as: "reviewer", attributes: userSummary },
      { model: User, as: "reviewee", attributes: userSummary },
      {
        model: ReviewSession,
        as: "reviewSession",
        attributes: reviewSummary,
        include: [cycleInclude],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
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
