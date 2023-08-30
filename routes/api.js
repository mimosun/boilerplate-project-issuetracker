'use strict';

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/ProjectController.js');

module.exports = function(app) {
  app.route('/api/issues/:project')
    .get(getProjects)
    .post(createProject)
    .put(updateProject)
    .delete(deleteProject);
};
