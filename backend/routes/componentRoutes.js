const express = require('express');
const router = express.Router();
const { getComponents, getComponentById } = require('../controllers/componentController');

router.route('/').get(getComponents);
router.route('/:id').get(getComponentById);

module.exports = router;
