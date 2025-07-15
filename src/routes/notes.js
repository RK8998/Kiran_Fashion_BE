const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const {
  getNotesListController,
  getNotesByIdController,
  createNotesController,
  deleteNotesController,
  updateNotesController
} = require('../controllers/notes.controller');

router.get('/', authenticate, getNotesListController);
router.get('/:id', authenticate, getNotesByIdController);
router.post('/', authenticate, createNotesController);
router.delete('/:id', authenticate, deleteNotesController);
router.put('/:id', authenticate, updateNotesController);

module.exports = { notesRoutes: router };
