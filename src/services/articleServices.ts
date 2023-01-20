import { isValidObjectId } from 'mongoose';
import HttpErrors from '../middleware/httpErrors';
import { Article, articleModle } from '../models/articleModel';
import { UserFromTokenTypes } from './types/userTypes';

interface InputData {
  title: string;
  description?: string;
  text: string;
  tags?: string[];
};

////CONSTANTS////////////////////////////////////////////////////////////////////
const articleFieldsConfig = ['_id', 'title', 'description', 'text', 'tags', 'createdAt', 'updatedAt']

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
/////////////////////////////////////////////////////////////////////////////////

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

export const getAllArticleService = async (): Promise<Article[]> => {
  try {
    const res = await articleModle.find()
    .populate(commentsPopulateConfig)
    .populate(authorPopulateConfig)
    .select(articleFieldsConfig);;
    if (!res)
      throw new HttpErrors(404, 'Failed to find articles', 'There are no articles yet!');

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find article', error.message);
  }
};

export const createArticleService = async (
  user: UserFromTokenTypes,
  body: InputData
): Promise<Article> => {
  try {
    const newArticle = new articleModle({
      author: user._id,
      ...body,
    });

    await newArticle.validate();

    const res = await newArticle.save();
    if (!res) throw new HttpErrors(404, 'Failed to create article', 'Something went wrong');

    return res;
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to create article`, error.message);
  }
};

export const updateArticleService = async (
  id: string,
  user: UserFromTokenTypes,
  body: InputData
): Promise<Article> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const access = await articleModle.findById(id);
    if (!access)
      throw new HttpErrors(404, 'Failed to update article', 'Article not found');

    if (access.author._id !== user._id && !user.isAdmin)
    throw new HttpErrors(401, 'Authorization failed', 'Access denied');

    const updatedArticle = new articleModle({ ...body });
    await updatedArticle.validate([...Array.from(Object.keys(body))]);

    const res = await articleModle.findByIdAndUpdate(id, { ...body }, { new: true });
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

export const deleteArticleService = async (
  id: string,
  user: UserFromTokenTypes
): Promise<string> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const access = await articleModle.findById(id);
    if (!access)
      throw new HttpErrors(404, 'Failed to delete article', 'Article not found');

    if (access.author._id !== user._id && !user.isAdmin)
      throw new HttpErrors(401, 'Authorization failed', 'Access denied');

    const res = await articleModle.findByIdAndDelete(id);
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
