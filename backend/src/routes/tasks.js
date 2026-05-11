const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

router.use(auth); 

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', moveTask);
router.delete('/:id', deleteTask);

module.exports = router;
