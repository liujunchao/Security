'use strict';
module.exports = () => {
  const config = exports = {};
  // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler', 'apiWrapper' ];
  config.errorHandler = {
    match: '*',
  };
};
