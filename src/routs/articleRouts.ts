import { Router } from 'express';
import {
  createArticleControl,
  deleteArticleControl,
  getAllArticleControl,
  getArticleControl,
  updateArticleControl,
} from '../controls/articleControls';
import { isAuthorized } from '../middleware/authMiddleware';

const articleRouter = Router();

articleRouter
  .route('/articles')
  .post(isAuthorized, createArticleControl)
  .get(getAllArticleControl);

articleRouter
  .route('/articles/:articleId')
  .get(getArticleControl)
  .put(isAuthorized, updateArticleControl)
  .delete(isAuthorized, deleteArticleControl);

export default articleRouter;
