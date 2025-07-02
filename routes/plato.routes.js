const express = require('express');
const router = express.Router();
const platoController = require('../controllers/plato.controller');

router.post('/', platoController.create);
router.get('/', platoController.getAll);
router.get('/:id', platoController.getById);
router.put('/:id', platoController.update);
router.delete('/:id', platoController.remove);

module.exports = router;
