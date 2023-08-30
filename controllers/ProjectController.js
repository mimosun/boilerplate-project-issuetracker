const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    let data = await Project.find({ project: req.params.project, ...req.query });
    res.json(data);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const data = getBodyData(req);
    data.project = req.params.project;

    if (!data.issue_title || !data.issue_text || !data.created_by) {
      return res.json({ error: 'required field(s) missing' });
    }

    const project = await Project.create(data);
    res.json(project);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  if (!req.body._id) {
    res.json({ error: 'missing _id' });
    return;
  }

  const query = {
    project: req.params.project,
    _id: req.body._id,
  };

  const data = getBodyData(req);
  
  if (!data || !Object.keys(data).length) {
    res.json({ error: 'no update field(s) sent', '_id': query._id });
    return;
  }

  try {
    const result = await Project.findOneAndUpdate(query, data);
    if (!result._id) {
      throw new Error('Could not update');
    }
    res.json({ result: 'successfully updated', '_id': query._id });
  } catch (err) {
    res.json({ error: 'could not update', '_id': query._id });
  }
};

exports.deleteProject = async (req, res) => {
  if (!req.body._id) {
    res.json({ error: 'missing _id' });
    return;
  }

  const query = {
    project: req.params.project,
    _id: req.body._id,
  };

  try {
    const result = await Project.findOneAndDelete(query);
    if (!result._id) {
      throw new Error('Could not delete');
    }
    res.json({ result: 'successfully deleted', '_id': query._id });
  } catch (err) {
    res.json({ error: 'could not delete', '_id': query._id });
  }
};

getBodyData = (req) => {
  const attributes = [
    'issue_title',
    'issue_text',
    'created_by',
    'assigned_to',
    'status_text',
  ];

  let data = {};

  for (let i in req.body) {
    if (req.body[i] && attributes.includes(i)) {
      data[i] = req.body[i];
    }
  }

  return data;
};
