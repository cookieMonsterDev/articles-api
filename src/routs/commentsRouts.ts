import { Router } from 'express';
import { createCommntControl } from '../controls/commentsControl';
import { isAuthorized } from '../middleware/authMiddleware';

const commentsRouter = Router();

commentsRouter
  .route('/articles/:id/comments')
  .post(isAuthorized, createCommntControl)
  // .get(getAllArticleControl)
  // .put(isAuthorized, updateArticleControl)
  // .delete(isAuthorized, deleteArticleControl);

export default commentsRouter;