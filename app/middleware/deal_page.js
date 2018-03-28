'use strict';
module.exports = () => {
  return async function (ctx, next) {
    const query = ctx.query;
    query.page = parseInt(query.page) ? parseInt(query.page) : 1;
    query.pageSize = parseInt(query.pageSize) ? parseInt(query.pageSize) : 10;
    query.offset = (query.page - 1) * query.pageSize;
    query.limit = query.pageSize;
    await next();
  };
};
