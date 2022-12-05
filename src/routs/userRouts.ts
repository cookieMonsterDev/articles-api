import { Router } from 'express';
import { createUserControl, loginUserControl } from '../core/controls/authControls';
import {
  deleteUserControl,
  getAllUsersControl,
  getUserControl,
  updateUserControl,
} from '../core/controls/userControls';

const userRouter = Router();

userRouter
  .route('/users/:id')
  .get(getUserControl)
  .put(updateUserControl)
  .delete(deleteUserControl);

userRouter.route('/users')
  .get(getAllUsersControl)
  .post(createUserControl);

userRouter.route('/users/login')
  .post(loginUserControl);

export default userRouter;
