import { isValidObjectId } from 'mongoose';
import { TokenTypes } from '../middleware/authMiddleware';
import HttpErrors from '../middleware/httpErrors';
import { articleModle } from '../models/articleModel';
import { Comment, commentModel } from '../models/commentModel';

interface Body {
  text: string;
}

interface InputData {
  articleId: string;
  tokenUser: TokenTypes;
  body: Body;
}

interface InputDataDelete {
  articleId: string;
  commentId: string;
  tokenUser: TokenTypes;
}

interface InputDataUpdate extends InputData {
  commentId: string;
}

////CONSTANTS////////////////////////////////////////////////////////////////////

const commentFieldsConfig = ['_id', 'article', 'text', 'createdAt', 'updatedAt'];

const authorPopulateConfig = {
  path: 'author',
  select: ['_id', 'username', 'email', 'name', 'surname', 'picture_url'],
};

/**
 * Validate commentId and return comment
 * @param commentId received from params of GET request
 * @returns { Comment }
 */
export const getCommentService = async (commentId: string): Promise<Comment> => {
  try {
    const validCommentId = isValidObjectId(commentId);
    if (!validCommentId) throw new Error('Id validation failed: incorrect commentId');

    const res = await commentModel
      .findById(commentId)
      .populate(authorPopulateConfig)
      .select(commentFieldsConfig);
    if (!res) throw new HttpErrors(404, 'Failed to find comment', 'Comment not found');

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find comment', error.message);
  }
};

/**
 * Validate articleId and return comment
 * @param articleId received from params of GET request
 * @returns { Comment[] }
 */
export const getAllCommentsService = async (articleId: string): Promise<Comment[]> => {
  try {
    const validArticleId = isValidObjectId(articleId);
    if (!validArticleId) throw new Error('Id validation failed: incorrect articleId');

    const res = await commentModel
      .find({ article: articleId })
      .populate(authorPopulateConfig)
      .select(commentFieldsConfig);
    if (!res) throw new HttpErrors(404, 'Failed to find comments', 'Comments not found');

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find comment', error.message);
  }
};

/**
 * Validate data, and return created comment
 * @param { string } articleId the articleId that recived from request params
 * @param { TokenTypes } tokenUser tokenUser the user data that recived from token
 * @param { InputData } body the data that recived from POST request
 * @returns { Comment }
 */
export const createCommentService = async ({
  articleId,
  tokenUser,
  body,
}: InputData): Promise<Comment> => {
  try {
    const validArticleId = isValidObjectId(articleId);
    if (!validArticleId) throw new Error('Id validation failed: incorrect articleId');

    const newComment = new commentModel({
      article: articleId,
      author: tokenUser._id,
      ...body,
    });

    await newComment.validate();
    const res = await newComment.save();
    if (!res)
      throw new HttpErrors(404, 'Failed to create comment', 'Something went wrong');

    await articleModle.findByIdAndUpdate(
      articleId,
      { $push: { comments: res._id } },
      { new: true }
    );

    return res;
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to create comment`, error.message);
  }
};

/**
 * Validate data, and return updated comment
 * @param { string } articleId the articleId that recived from request params
 * @param { string } commentId the commentId that recived from request params
 * @param { TokenTypes } tokenUser tokenUser the user data that recived from token
 * @param { InputData } body the data that recived from POST request
 * @returns { Comment }
 */
export const updateCommentService = async ({
  articleId,
  commentId,
  tokenUser,
  body,
}: InputDataUpdate): Promise<Comment> => {
  try {
    const validArticleId = isValidObjectId(articleId);
    if (!validArticleId) throw new Error('Id validation failed: incorrect articleId');

    const validCommentId = isValidObjectId(commentId);
    if (!validCommentId) throw new Error('Id validation failed: incorrect commentId');

    const access = await commentModel.findById(commentId);
    if (!access)
      throw new HttpErrors(404, 'Failed to update comment', 'Comment not found');

    if (access.article.toString() !== tokenUser._id && !tokenUser.isAdmin)
      throw new HttpErrors(401, 'Authorization failed', 'Access denied');

    const res = await commentModel
      .findByIdAndUpdate(commentId, { body }, { new: true })
      .populate(authorPopulateConfig)
      .select(commentFieldsConfig);
    if (!res)
      throw new HttpErrors(404, 'Failed to update comment', 'Something went wrong');

    return res;
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to update comment`, error.message);
  }
};

/**
 * Validate data, and return updated comment
 * @param { string } articleId the articleId that recived from request params
 * @param { string } commentId the commentId that recived from request params
 * @param { TokenTypes } tokenUser tokenUser the user data that recived from token
 * @param { InputData } body the data that recived from POST request
 * @returns { Comment }
 */
export const deleteCommentService = async ({
  articleId,
  commentId,
  tokenUser,
}: InputDataDelete): Promise<string> => {
  try {
    const validArticleId = isValidObjectId(articleId);
    if (!validArticleId) throw new Error('Id validation failed: incorrect articleId');

    const validCommentId = isValidObjectId(commentId);
    if (!validCommentId) throw new Error('Id validation failed: incorrect commentId');

    const access = await commentModel.findById(commentId);
    if (!access)
      throw new HttpErrors(404, 'Failed to update comment', 'Comment not found');

    if (access.article.toString() !== tokenUser._id && !tokenUser.isAdmin)
      throw new HttpErrors(401, 'Authorization failed', 'Access denied');

    const res = await commentModel.findByIdAndDelete(commentId);
    if (!res)
      throw new HttpErrors(404, 'Failed to update comment', 'Something went wrong');

    await articleModle.findByIdAndUpdate(
      articleId,
      { $pull: { comments: res._id } },
      { new: true }
    );

    return res._id.toString();
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to update comment`, error.message);
  }
};
