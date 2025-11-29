const Component = require('../models/Component');

const getComponents = async (req, res) => {
    const { type } = req.query;
    if (type) {
        const components = Component.findByType(type);
        res.json(components);
    } else {
        const components = Component.findAll();
        res.json(components);
    }
};

const getComponentById = async (req, res) => {
    const component = Component.findById(req.params.id);
    if (component) {
        res.json(component);
    } else {
        res.status(404).json({ message: 'Component not found' });
    }
};

module.exports = { getComponents, getComponentById };
