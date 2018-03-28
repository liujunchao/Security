'use strict';

// had enabled by egg
exports.static = true;

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
exports.oss = {
  enable: true,
  package: 'egg-oss',
};
exports.jwt = {
	enable: true,
	package: 'egg-jwt'
}