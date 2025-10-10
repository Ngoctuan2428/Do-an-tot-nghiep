const commentService = require('../services/comment.service');

const createComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.recipeId;
        const commentData = req.body;
        const newComment = await commentService.createComment(userId, recipeId, commentData);
        res.status(201).json({ status: 'success', data: newComment });
    } catch (error) {
        next(error);
    }
};

const getCommentsByRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.recipeId;
        const comments = await commentService.getCommentsByRecipeId(recipeId, req.query);
        res.status(200).json({ status: 'success', data: comments });
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const updatedComment = await commentService.updateComment(commentId, userId, req.body);
        res.status(200).json({ status: 'success', data: updatedComment });
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const commentId = req.params.commentId;
        await commentService.deleteComment(commentId, userId, userRole);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { createComment, getCommentsByRecipe, updateComment, deleteComment };