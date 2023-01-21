import { Router } from 'express';
import { createUserControl, loginUserControl } from '../controls/authControls';
import {
  deleteUserControl,
  getAllUsersControl,
  getUserControl,
  updateUserControl,
} from '../controls/userControls';
import { isAuthorized } from '../middleware/authMiddleware';

const userRouter = Router();

userRouter
  .route('/users/:userId')
  .get(getUserControl)
  .put(isAuthorized, updateUserControl)
  .delete(isAuthorized, deleteUserControl);

userRouter.route('/users').get(getAllUsersControl).post(createUserControl);

userRouter.route('/users/login').post(loginUserControl);

export default userRouter;
