import { Router } from 'express';
import { createUserControl } from '../core/controls/authControls';
import { deleteUserControl, getUserControl, updateUserControl } from '../core/controls/userControls';

const userRouter = Router();

userRouter
  .route('/users/:id')
  .get(getUserControl)
  .put(updateUserControl)
  .delete(deleteUserControl)

userRouter
  .route('/users')
  .post(createUserControl);


export default userRouter;
