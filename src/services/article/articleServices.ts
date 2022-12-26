import { isValidObjectId } from 'mongoose';
import HttpErrors from '../../middleware/httpErrors';
import { articleModle } from '../../models/articleModel';
import { InputArticleTypes, OutputArticleTypes } from '../types/articleTypes';
import { UserFromTokenTypes } from '../types/userTypes';

export const createArticleService = async (
  user: UserFromTokenTypes,
  body: InputArticleTypes
): Promise<OutputArticleTypes> => {
  try {
    const newArticle = new articleModle({
      user_id: user.id,
      author: user.username,
      author_picture: user.pictureURL,
      ...body,
    });

    await newArticle.validate();

    const res = await newArticle.save();
    if(!res) throw new HttpErrors(404, 'Failed to create article', 'Something went wrong');

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

export const getArticleService = async (id: string): Promise<OutputArticleTypes> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await articleModle.findById(id);
    if (!res) throw new HttpErrors(404, 'Failed to find article', 'Article not found');

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
    throw new HttpErrors(404, 'Failed to find article', error.message);
  }
};

export const getAllArticleService = async (): Promise<OutputArticleTypes[]> => {
  try {
    const res = await articleModle.find();
    if (!res) throw new HttpErrors(404, 'Failed to find articles', 'There are no articles yet!');

    const modRes = res.map((i) => {
      return {
        id: i._id.toString(),
        user_id: i.user_id,
        author: i.author,
        author_picture: i.author_picture!,
        title: i.title,
        description: i.description,
        article_content: i.article_content,
        tags: i.tags,
        comments: i.comments,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      };
    });

    return modRes;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find article', error.message);
  }
};

export const updateArticleService = async (id: string,
  user: UserFromTokenTypes, body: InputArticleTypes): Promise<OutputArticleTypes> => {
    try {
      const objectId = isValidObjectId(id);
      if (!objectId) throw new Error('Id validation failed: incorrect objectId');
  
      const access = await articleModle.findById(id);
      if (!access) throw new HttpErrors(404, 'Failed to update article', 'Article not found');

      if (access.user_id !== user.id && !user.isAdmin)
      throw new HttpErrors(401, 'Authorization failed', 'Access denied');

      const updatedArticle = new articleModle({ ...body });
      await updatedArticle.validate([...Array.from(Object.keys(body))]);

      const res = await articleModle.findByIdAndUpdate(id, { ...body }, { new: true });
      if (!res) throw new HttpErrors(404, 'Failed to update article', 'Article not found');

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
    }
    catch(error) {
      throw new HttpErrors(
        error.status || 404,
        error.message || 'Failed to update article',
        error.reason
      );
    }
}

export const deleteArticleService = async (
  id: string,
  user: UserFromTokenTypes
): Promise<string> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const access = await articleModle.findById(id);
    if (!access) throw new HttpErrors(404, 'Failed to delete article', 'Article not found');
 
    if (access.user_id !== user.id && !user.isAdmin)
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
