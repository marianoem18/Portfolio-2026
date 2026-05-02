const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getMenu);
router.post('/item', menuController.createItem);
router.put('/item/:id', menuController.updateItem);
router.delete('/item/:id', menuController.deleteItem);

module.exports = router;