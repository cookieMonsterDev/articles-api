import { isValidObjectId } from 'mongoose';
import HttpErrors from '../middleware/httpErrors';
import { articleModle } from '../models/articleModel';
import { commentModel } from '../models/commentModel';

export const createCommentService = async (
  user: any,
  articleId: string,
  body: any
): Promise<any> => {
  console.log(articleId);

  try {
    const newComment = new commentModel({
      article: articleId,
      author: user._id,
      ...body,
    });

    await newComment.validate();
    const savedComment = await newComment.save();

    await articleModle.findByIdAndUpdate(
      articleId,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    return savedComment;
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to create article`, error.message);
  }
};
