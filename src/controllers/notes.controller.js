const { ApiResponse } = require('../utils/constants');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const NotesModel = require('../models/notes');
// const mongoose = require('mongoose');

const getNotesListController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const rows = parseInt(req.query.rows) || 10;
    const offset = (page - 1) * rows;

    // const results = await NotesModel.find({
    //   deleted_at: null
    // })
    //   .populate('created_by', 'name email')
    //   .sort({ created_at: -1 })
    //   .skip(offset)
    //   .limit(rows);

    const results = await NotesModel.aggregate([
      { $match: { deleted_at: null } },
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          as: 'created_by'
        }
      },
      {
        $unwind: '$created_by'
      },
      {
        $sort: { created_at: -1 }
      },
      {
        $skip: offset
      },
      {
        $limit: rows
      },
      {
        $project: { created_by: { password: 0 } }
      }
    ]);

    const total = await NotesModel.countDocuments({
      deleted_at: null
    });

    return sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Notes list fetched successfully',
      data: { results, total }
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to get notes list',
      error
    });
  }
};

const getNotesByIdController = async (req, res) => {
  try {
    const notesId = req.params.id;

    if (!notesId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Notes ID is required'
      });
    }

    const note = await NotesModel.findOne({ _id: notesId, deleted_at: null }).populate(
      'created_by',
      '-password'
    );

    // const note = await NotesModel.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(notesId),
    //       deleted_at: null
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'created_by',
    //       foreignField: '_id',
    //       as: 'created_by'
    //     }
    //   },
    //   {
    //     $unwind: { path:  '$created_by', preserveNullAndEmptyArrays: true}
    //   },
    //   {
    //     $project: { created_by: { password: 0 } }
    //   }
    // ]);

    if (!note) {
      return sendErrorResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'Note Not Found.'
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: note,
      message: 'Note fetched successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const createNotesController = async (req, res) => {
  try {
    const data = req.body;

    const newNote = await NotesModel({ ...data, created_by: req.user._id });

    await newNote.save();

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: newNote,
      message: 'Notes created successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const deleteNotesController = async (req, res) => {
  try {
    const notesId = req.params.id;

    if (!notesId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Notes ID is required'
      });
    }

    const product = await NotesModel.findOne({
      _id: notesId,
      deleted_at: null
    });

    if (!product) {
      return sendErrorResponse(res, {
        ...ApiResponse.NOT_FOUND,
        data: null,
        message: 'Note Not found'
      });
    }

    const deletedNote = await NotesModel.findByIdAndUpdate(
      notesId,
      {
        deleted_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!deletedNote)
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Failed to delete Note.'
      });

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: deletedNote,
      message: 'Note deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const updateNotesController = async (req, res) => {
  try {
    const notesId = req.params.id;
    const data = req.body;

    const updatedNote = await NotesModel.findOneAndUpdate(
      { _id: notesId, deleted_at: null },
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedNote) {
      return sendSuccessResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'Note not found',
        data: []
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    // res.status(500).json({ error: 'Failed to create user' });
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

module.exports = {
  getNotesListController,
  getNotesByIdController,
  createNotesController,
  deleteNotesController,
  updateNotesController
};
