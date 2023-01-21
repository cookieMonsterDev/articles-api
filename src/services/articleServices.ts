import { isValidObjectId } from 'mongoose';
import { TokenTypes } from '../middleware/authMiddleware';
import HttpErrors from '../middleware/httpErrors';
import { Article, articleModle } from '../models/articleModel';

interface InputData {
  title: string;
  description?: string;
  text: string;
  tags?: string[];
}

interface UserArticleTypes {
  articleId: string;
  tokenUser: TokenTypes;
  body: InputData;
}

////CONSTANTS////////////////////////////////////////////////////////////////////
const articleFieldsConfig = [
  '_id',
  'title',
  'description',
  'text',
  'tags',
  'createdAt',
  'updatedAt',
];

const authorPopulateConfig = {
  path: 'author',
  select: ['_id', 'username', 'email', 'name', 'surname', 'picture_url'],
};

const commentsPopulateConfig = {
  path: 'comments',
  select: ['_id', 'text', 'createdAt', 'updatedAt'],
  populate: {
    path: 'author',
    select: ['_id', 'username', 'email', 'name', 'surname', 'picture_url'],
  },
};

/**
 * Validate articleId and return article
 * @param articleId received from params of GET request
 * @returns { Article }
 */
export const getArticleService = async (articleId: string): Promise<Article> => {
  try {
    const objectId = isValidObjectId(articleId);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await articleModle
      .findById(articleId)
      .populate(commentsPopulateConfig)
      .populate(authorPopulateConfig)
      .select(articleFieldsConfig);
    if (!res) throw new HttpErrors(404, 'Failed to find article', 'Article not found');

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find article', error.message);
  }
};

/**
 * Return all article
 * @returns { Article[] }
 */
export const getAllArticleService = async (): Promise<Article[]> => {
  try {
    const res = await articleModle
      .find()
      .populate(commentsPopulateConfig)
      .populate(authorPopulateConfig)
      .select(articleFieldsConfig);
    if (!res)
      throw new HttpErrors(404, 'Failed to find articles', 'There are no articles yet!');

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find article', error.message);
  }
};

/**
 * Validate data, and return article
 * @param { TokenTypes } tokenUser tokenUser the user data that recived from token
 * @param { InputData } body the data that recived from POST request
 * @returns { Article }
 */
export const createArticleService = async (
  tokenUser: TokenTypes,
  body: InputData
): Promise<Article> => {
  try {
    const newArticle = new articleModle({
      author: tokenUser._id,
      ...body,
    });

    await newArticle.validate();

    const res = await newArticle.save();
    if (!res)
      throw new HttpErrors(404, 'Failed to create article', 'Something went wrong');

    return res;
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to create article`, error.message);
  }
};

/**
 * Validate authorization and data, and return  updated article
 * @param { string } articleId the articleId of that recived from request params
 * @param { TokenTypes } tokenUser tokenUser the user data that recived from token
 * @param { InputData } body the data that recived from POST request
 * @returns { Article }
 */
export const updateArticleService = async ({
  articleId,
  tokenUser,
  body,
}: UserArticleTypes): Promise<Article> => {
  try {
    const objectId = isValidObjectId(articleId);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const access = await articleModle.findById(articleId);
    if (!access)
      throw new HttpErrors(404, 'Failed to update article', 'Article not found');

    if (access.author._id !== tokenUser._id && !tokenUser.isAdmin)
      throw new HttpErrors(401, 'Authorization failed', 'Access denied');

    const updatedArticle = new articleModle({ ...body });
    await updatedArticle.validate([...Array.from(Object.keys(body))]);

    const res = await articleModle
      .findByIdAndUpdate(articleId, { ...body }, { new: true })
      .populate(commentsPopulateConfig)
      .populate(authorPopulateConfig)
      .select(articleFieldsConfig);
    if (!res) throw new HttpErrors(404, 'Failed to update article', 'Article not found');

    return res;
  } catch (error) {
    throw new HttpErrors(
      error.status || 404,
      error.message || 'Failed to update article',
      error.reason
    );
  }
};

/**
 * Validate authorization and data, and return deleted article id
 * @param { string } articleId the articleId of that recived from request params
 * @param { TokenTypes } tokenUser tokenUser the user data that recived from token
 * @returns { string }
 */
export const deleteArticleService = async (
  articleId: string,
  tokenUser: TokenTypes
): Promise<string> => {
  try {
    const objectId = isValidObjectId(articleId);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const access = await articleModle.findById(articleId);
    if (!access)
      throw new HttpErrors(404, 'Failed to delete article', 'Article not found');

    if (access.author._id !== tokenUser._id && !tokenUser.isAdmin)
      throw new HttpErrors(401, 'Authorization failed', 'Access denied');

    const res = await articleModle.findByIdAndDelete(articleId);
    if (!res) throw new Error('Article not found');

    return res._id.toString();
  } catch (error) {
    throw new HttpErrors(
      error.status || 404,
      error.message || 'Failed to delete article',
      error.reason
    );
  }
};
