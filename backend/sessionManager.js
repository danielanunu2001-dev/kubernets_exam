// sessionManager.js
let currentUser = null;

module.exports = {
  getCurrentUser: () => currentUser,
  setCurrentUser: (user) => { currentUser = user; },
  clearCurrentUser: () => { currentUser = null; }
};
