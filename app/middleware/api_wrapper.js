module.exports = (options, app) => {
  return async function apiWrapperMiddleware(ctx, next) {
    ctx.set("Access-Control-Expose-Headers", "token");
    if (ctx.method=="OPTIONS") {
      ctx.set("Access-Control-Allow-Origin","*");
      ctx.set("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
      ctx.set("Access-Control-Allow-Credentials",false);
      ctx.set("Access-Control-Max-Age",'86400'); // 24 hours
      ctx.set("Access-Control-Allow-Headers","X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
      ctx.status = 200;
      return;
    };
    await next();
  };
};