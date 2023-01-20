import { Router } from 'express';
import { createCommntControl, getCommntControl } from '../controls/commentsControl';
import { isAuthorized } from '../middleware/authMiddleware';

const commentsRouter = Router();

commentsRouter
  .route('/articles/:id/comments')
  .post(isAuthorized, createCommntControl)
  // .get(getAllArticleControl)
  // .put(isAuthorized, updateArticleControl)
  // .delete(isAuthorized, deleteArticleControl);

commentsRouter
  .route('/articles/:articleId/comments/:commentId')
  .get(isAuthorized, getCommntControl)

export default commentsRouter;