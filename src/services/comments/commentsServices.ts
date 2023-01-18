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
): Promise<OutputArticleTypes> => {
  console.log(articleId)

  try {
    const objectId = isValidObjectId(articleId);

    const newComment = new commentModel({  
      user_id: user.id,
      author: user.username,
      author_picture: user.pictureURL,
      ...body,})

    await newComment.validate();
    const savedComment = await newComment.save();
    if(!savedComment) throw new HttpErrors(404, 'Failed to create comment', 'Something went wrong');

    const { _id } = savedComment

    const article = await articleModle.findById(articleId);
    if(!article) throw new HttpErrors(404, 'Failed to find article', 'Something went wrong');

    const res = await articleModle.findByIdAndUpdate(articleId, { comments: [...article.comments, _id] }, { new: true });
    if(!res) throw new HttpErrors(404, 'Failed to create comment', 'Something went wrong');

    return {
      id: res._id.toString(),
      user_id: res.user_id,
      author: res.author,
      author_picture: res.author_picture!,
      title: res.title,
      description: res.description,
      article_content: res.article_content,
      tags: res.tags,
      comments: res.comments,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  } catch (error) {
    throw new HttpErrors(
      error.status || 401,
      `Failed to create article`,
      error.message
    );
  }
};