// Mock User Model
// In a real app, this would be a Mongoose schema

const users = [];

module.exports = {
    users,
    create: (user) => {
        const newUser = { id: Date.now().toString(), ...user };
        users.push(newUser);
        return newUser;
    },
    findByUsername: (username) => users.find(u => u.username === username),
    findById: (id) => users.find(u => u.id === id)
};
