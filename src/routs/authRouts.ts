import { Router } from 'express';
import { createUserControl } from '../core/controls/authControls';

const authRouter = Router();

authRouter
  .route('/user/:id')
  .get((req, res) => {
    res.send({ data: 'user get / not' });
  })
  .put((req, res) => {
    res.send({ data: 'user put' });
  });

authRouter
  .route('/users')
  .get((req, res) => {
    res.send({ data: 'users get amd / not' });
  })
  .post(createUserControl);

authRouter.route('/users/login').post((req, res) => {
  res.send({ data: 'user login' });
});

export default authRouter;
