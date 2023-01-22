import { Router } from 'express';
import { createCommntControl, deleteCommntControl, getAllCommentsControl, getCommentControl, updateCommntControl, } from '../controls/commentsControl';
import { isAuthorized } from '../middleware/authMiddleware';

const commentsRouter = Router();

commentsRouter
  .route('/articles/:articleId/comments')
  .post(isAuthorized, createCommntControl)
  .get(getAllCommentsControl)

commentsRouter
  .route('/articles/:articleId/comments/:commentId')
  .get(getCommentControl)
  .put(isAuthorized, updateCommntControl)
  .delete(isAuthorized, deleteCommntControl);

export default commentsRouter;