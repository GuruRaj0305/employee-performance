const express = require("express");
const reviewController = require("./review.controller");
const validate = require("../../middleware/validate.middleware");
const { onlyAdmin, userAuthentication } = require("../../middleware/auth.middleware");
const { assignmentSchema, feedbackSchema, performanceCycleSchema, reviewSessionSchema, updatePerformanceCycleSchema, updateReviewSessionSchema } = require("./review.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Review sessions, performance cycles, assignments, and feedback
 *
 * /reviews/feedback-requests:
 *   get:
 *     tags: [Reviews]
 *     summary: List current employee feedback requests
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Feedback requests fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/feedback-requests", reviewController.listFeedbackRequests);

/**
 * @swagger
 * /reviews/feedback-requests/{assignmentId}/feedback:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit feedback for an assigned review request
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, star]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Great collaboration
 *               detail:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Helped unblock the team quickly.
 *               star:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Feedback submitted successfully.
 *       400:
 *         description: Validation error or closed review.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Feedback request not found.
 */
router.post("/feedback-requests/:assignmentId/feedback", validate(feedbackSchema), reviewController.submitFeedback);

/**
 * @swagger
 * /reviews/cycles:
 *   get:
 *     tags: [Reviews]
 *     summary: List performance cycles
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Performance cycles fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/cycles", onlyAdmin(), reviewController.listPerformanceCycles);

/**
 * @swagger
 * /reviews/cycles:
 *   post:
 *     tags: [Reviews]
 *     summary: Create performance cycle
 *     description: Creating a new cycle automatically closes existing open cycles and review sessions.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *                 example: 2026 Performance
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Performance cycle created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Cycle name already exists.
 */
router.post("/cycles", onlyAdmin(), validate(performanceCycleSchema), reviewController.createPerformanceCycle);

/**
 * @swagger
 * /reviews/cycles/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update or close performance cycle
 *     description: Set active=false to close a cycle. Closed cycles cannot be reopened.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Performance cycle updated successfully.
 *       400:
 *         description: Validation error or attempted reopen.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Performance cycle not found.
 *       409:
 *         description: Cycle name already exists.
 */
router.patch("/cycles/:id", onlyAdmin(), validate(updatePerformanceCycleSchema), reviewController.updatePerformanceCycle);

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List review sessions
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: performanceCycleId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review sessions fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/", onlyAdmin(), reviewController.listReviewSessions);

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create review session
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [performanceCycleId, targetUserId, name]
 *             properties:
 *               performanceCycleId:
 *                 type: string
 *                 format: uuid
 *               targetUserId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *                 example: Q1 Peer Review
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Review session created successfully.
 *       400:
 *         description: Validation error or closed cycle.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Performance cycle or employee not found.
 */
router.post("/", onlyAdmin(), validate(reviewSessionSchema), reviewController.createReviewSession);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update review session
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               performanceCycleId:
 *                 type: string
 *                 format: uuid
 *               targetUserId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review session updated successfully.
 *       400:
 *         description: Validation error or closed cycle.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Review session not found.
 */
router.patch("/:id", onlyAdmin(), validate(updateReviewSessionSchema), reviewController.updateReviewSession);

/**
 * @swagger
 * /reviews/{id}/assignments:
 *   post:
 *     tags: [Reviews]
 *     summary: Assign reviewers to a review session
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewerId:
 *                 type: string
 *                 format: uuid
 *               reviewerIds:
 *                 type: array
 *                 minItems: 1
 *                 uniqueItems: true
 *                 items:
 *                   type: string
 *                   format: uuid
 *               revieweeId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *             anyOf:
 *               - required: [reviewerId]
 *               - required: [reviewerIds]
 *     responses:
 *       201:
 *         description: Employee assigned successfully.
 *       400:
 *         description: Validation error or closed review.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Review session or employee not found.
 */
router.post("/:id/assignments", onlyAdmin(), validate(assignmentSchema), reviewController.assignReviewer);

/**
 * @swagger
 * /reviews/{userId}/reviews/{reviewSessionId}:
 *   get:
 *     tags: [Reviews]
 *     summary: List feedback for an employee in a review session
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: reviewSessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Employee review feedback fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/:userId/reviews/:reviewSessionId", onlyAdmin(), reviewController.listReviewsForEmployee);

module.exports = router;
