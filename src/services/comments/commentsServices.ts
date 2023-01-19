import { isValidObjectId } from 'mongoose';
import HttpErrors from '../../middleware/httpErrors';
import { articleModle } from '../../models/articleModel';
import { commentModel } from '../../models/commentModel';
import { OutputArticleTypes } from '../types/articleTypes';
import { InputCommentTypes, OutputCommentTypes } from '../types/commentTypes';
import { UserFromTokenTypes } from '../types/userTypes';


export const createCommentService = async (
  user: UserFromTokenTypes,
  articleId: string,
  body: InputCommentTypes
): Promise<any> => {
  console.log(articleId)

  try {

    const newComment = new commentModel({  
      article: articleId,
      author: user.id,
      ...body,})

    await newComment.validate();
    const savedComment = await newComment.save();

    await articleModle.findByIdAndUpdate(articleId, { "$push": { "comments": savedComment._id } },{ new: true },)
    

    return savedComment
  } catch (error) {
    throw new HttpErrors(
      error.status || 401,
      `Failed to create article`,
      error.message
    );
  }
};