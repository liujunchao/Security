'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.resources('user', '/user', 'user');
  app.post('user.login', '/user/login', 'user.login');
  app.get('user.verify', '/user/verify', 'user.verify');
  app.post('user.unique', '/user/unique', 'user.unique');
  app.post('user.modifypass', '/user/modifypass', 'user.modifyPass');
  // app.post('user.proxy', /^\/proxy.*/, 'user.proxy');	
  app.get('/resources', 'resources.getResources');
  app.post('/submitRoleResConfig','resources.submitRoleResConfig');
  app.resources('role', '/role', 'role');
  app.post('role.setusers', '/role/setusers', 'role.setUsers');
  app.get('role.getusers', '/role/getusers', 'role.getUsers');
  app.post('role.unique', '/role/unique', 'role.unique');
  app.get( '/flow/index', 'flow.index');
  app.get( '/flow/newflow', 'flow.newflow');
  app.post( '/flow/createTask', 'flow.createTask');
  app.get( '/flow/newCode', 'flow.newCode');
};
