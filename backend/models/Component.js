// Mock Component Model
const components = require('../data/components.json');

module.exports = {
    findAll: () => components,
    findByType: (type) => components.filter(c => c.type === type),
    findById: (id) => components.find(c => c.id === id)
};
