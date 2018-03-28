egg-sequelize
=============

[Sequelize](http://sequelizejs.com) plugin for Egg.js.

> NOTE: 这个插件仅仅是集成 Sequelize 近 Egg.js, 更多关于Sequelize的文档,请移步官网 http://sequelizejs.com.

[![NPM version](https://img.shields.io/npm/v/egg-sequelize.svg?style=flat-square)](https://npmjs.org/package/egg-sequelize)[![build status](https://img.shields.io/travis/eggjs/egg-sequelize.svg?style=flat-square)](https://travis-ci.org/eggjs/egg-sequelize)[![Test coverage](https://codecov.io/gh/eggjs/egg-sequelize/branch/master/graph/badge.svg)](https://codecov.io/gh/eggjs/egg-sequelize)[![David deps](https://img.shields.io/david/eggjs/egg-sequelize.svg?style=flat-square)](https://david-dm.org/eggjs/egg-sequelize)[![Known Vulnerabilities](https://snyk.io/test/npm/egg-sequelize/badge.svg?style=flat-square)](https://snyk.io/test/npm/egg-sequelize)[![npm download](https://img.shields.io/npm/dm/egg-sequelize.svg?style=flat-square)](https://npmjs.org/package/egg-sequelize)

安装
----

```bash
$ npm i --save egg-sequelize
$ npm install --save mysql2 # For both mysql and mariadb dialects

# 或者我们使用其他类型的数据库
$ npm install --save pg pg-hstore # PostgreSQL
$ npm install --save tedious # MSSQL
```

用法和配置
----------

-	`config.default.js` 配置数据库连接

```js
exports.sequelize = {
  dialect: 'mysql', // 支持: mysql, mariadb, postgres, mssql
  database: 'test',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '',
};
```

-	`config/plugin.js` 开启插件

```js
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}
```

-	`package.json`

```
{
"scripts": {
"migrate:new": "egg-sequelize migration:create",
"migrate:up": "egg-sequelize db:migrate",
"migrate:down": "egg-sequelize db:migrate:undo"
}
```

更多文档请移步至: [Sequelize.js](http://sequelize.readthedocs.io/en/v3/)

Model files
-----------

请把 models 放在 `app/model` 文件夹下.

Conventions
-----------

| model file      | class name            |
|-----------------|-----------------------|
| `user.js`       | `app.model.User`      |
| `person.js`     | `app.model.Person`    |
| `user_group.js` | `app.model.UserGroup` |

-	数据库表总是有时间戳字段: `created_at datetime`, `updated_at datetime`.
-	字段名请使用下划线风格的, 如: `user_id`, `comments_count`.

案列：
------

### 标准的

先定义一个 model 文件.

```js
// app/model/user.js

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    login: STRING,
    name: STRING(30),
    password: STRING(32),
    age: INTEGER,
    last_sign_in_at: DATE,
    created_at: DATE,
    updated_at: DATE,
  });

  User.findByLogin = function* (login) {
    return yield this.findOne({ login: login });
  }

  User.prototype.logSignin = function* () {
    yield this.update({ last_sign_in_at: new Date() });
  }

  return User;
};

```

现在你可以在你的 controller中使用它:

```js
// app/controller/user.js
module.exports = app => {
  return class UserController extends app.Controller {
    * index() {
      const users = yield this.ctx.model.User.findAll();
      this.ctx.body = users;
    }

    * show() {
      const user = yield this.ctx.model.User.findByLogin(this.ctx.params.login);
      yield user.logSignin();
      this.ctx.body = user;
    }
  }
}
```

### 完整教程 example

```js
// app/model/post.js

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Post = app.model.define('Post', {
    name: STRING(30),
    user_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });
  // 关联模型
  Post.associate = function() {
    app.model.Post.belongsTo(app.model.User, { as: 'user' });
  }

  return Post;
};
```

```js
// app/controller/post.js
module.exports = app => {
  return class PostController extends app.Controller {
    * index() {
      const posts = yield this.ctx.model.Post.findAll({
        attributes: [ 'id', 'user_id' ],
        include: { model: this.ctx.model.User, as: 'user' },
        where: { status: 'publish' },
        order: 'id desc',
      });

      this.ctx.body = posts;
    }

    * show() {
      const post = yield this.ctx.model.Post.findById(this.params.id);
      const user = yield post.getUser();
      post.setDataValue('user', user);
      this.ctx.body = post;
    }

    * destroy() {
      const post = yield this.ctx.model.Post.findById(this.params.id);
      yield post.destroy();
      this.ctx.body = { success: true };
    }
  }
}
```

同步 model 到数据库
-------------------

提示,如果你想同步 model 模型到你定义好的数据库 (mysql or etc.), 你必须要加一个一部操作到你项目的 `app.js`.

```js
// {app_root}/app.js
  module.exports = app => {
    app.beforeStart(function* () {
      yield app.model.sync({force: true});
    });
  };
```

迁移
----

如果你有添加 egg-sequelize 到你的 `package.json`,现在你可以:

| Command              | Description                                    |
|----------------------|------------------------------------------------|
| npm run migrate:new  | Generate a new Migration file to ./migrations/ |
| npm run migrate:up   | Run Migration                                  |
| npm run migrate:down | 回滚一次 Migration                             |

案例:

```bash
$ npm run migrate:up
```

For `test` 测试环境:

```bash
$ NODE_ENV=test npm run migrate:up
```

or for `production` environment:

```bash
$ NODE_ENV=production npm run migrate:up
```

Write migrations with **Generator** friendly, you should use `co.wrap` method:

```js
'use strict';
const co = require('co');

module.exports = {
  up: co.wrap(function *(db, Sequelize) {
    const { STRING, INTEGER, DATE } = Sequelize;

    yield db.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING, allowNull: false },
      email: { type: STRING, allowNull: false },
      created_at: DATE,
      updated_at: DATE,
    });

    yield db.addIndex('users', ['email'], { indicesType: 'UNIQUE' });
  }),

  down: co.wrap(function *(db, Sequelize) {
    yield db.dropTable('users');
  }),
};
```

And you may need to read [Sequelize - Migrations](http://docs.sequelizejs.com/manual/tutorial/migrations.html) to learn about how to write Migrations.

Recommended example
-------------------

-	https://github.com/eggjs/examples/tree/master/sequelize-example/

Questions & Suggestions
-----------------------

Please open an issue [here](https://github.com/eggjs/egg/issues).

License
-------

[MIT](LICENSE)
