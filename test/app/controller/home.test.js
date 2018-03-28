'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {

  // it('should assert', function* () {
  //   const pkg = require('../../../package.json');
  //   console.log(pkg.name);
  //   assert(app.config.keys.startsWith(pkg.name));

  //   // const ctx = app.mockContext({});
  //   // yield ctx.service.xx();
  // });



  it('should POST /flow/createTask', () => {
    return app.httpRequest()
      .post('/flow/createTask')
      .type('form')
      .send({task:{
        name:"任务测试",
        taskType:"重点用户监视",
        nature:1,
        operatorId:1, 
        urgencyLevel:"一般",
        secretLevel:"机密",
        taskContent:"该用户有犯罪嫌疑。。。",
        contentAttachment:"file1,file2",
        basis:"依据是。。。。",
        basisAttachment:"file1,file2",
        startDate:1522142344,
        endDate:1522142356
      }}) 
      .expect(200);
  });

  return;

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, egg')
      .expect(200);
  });

  it('should GET /flow/newCode', () => {
    return app.httpRequest()
      .get('/flow/newCode')
      .expect(200);
  });
 

  it('should GET /flow/newflow', () => {
    return app.httpRequest()
      .get('/flow/newflow?type=applierFlow')
      .expect(200);
  });
  





});
