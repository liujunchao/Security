const Controller = require('egg').Controller;
const nodemailer = require('nodemailer');

class UserController extends Controller { 
	/**
	 * 返回用户列表
	 */
	async index() {
		const users = await this.ctx.service.user.index();
		this.ctx.body = {
			code: 1,
			response: users
		}
	}

	/**
	 * 根据id号获取单个用户
	 */
	async show() {
		const id = this.ctx.params.id;
		if(!id) {
			this.ctx.body = {
				code: 0,
				message: 'id号不存在'
			}
			return;
		}
		const user = await this.ctx.service.user.show(id);
		this.ctx.body = {
			code: 1,
			response: user
		}
	}

	/**
	 * 登录
	 * @param {string} username 用户名
	 * @param {string} password 密码
	 * @returns {int} code 1表示成功,0表示用户名或密码不正确,-1表示该用户不能登录
	 * @returns {string} username 成功后返回的用户名
	 */
	async login() {
		let code = 0,
			msg = 'fail',
			username = '';
		const rule = {
			username: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		}
		this.ctx.validate(rule);
		const user = await this.service.user.find(this.ctx.request.body);
		let opList = {};
		if(user && user.id) {
			const roles = await user.getRole();
			console.log(roles.length)
			for(let role of roles){
				console.log(role.id)
				let operations = await role.getRoleResOperation();
				for(let op of operations){
					if(!opList[op.resKey]) {
						opList[op.resKey] = [op.opKey];
					}else {
						opList[op.resKey].push(op.opKey)
					}
					//opList.push(op);
					//  let key = `${op.resKey}-${op.opKey}`;
					//  if(opList.indexOf(key)===-1){
						// opList.push(key);
					//  }
				}
			}
			const now = Date.now();
			const start = user.startDate ? user.startDate.getTime() : '';
			const end = user.endDate ? user.endDate.getTime() : '';
			if((start && start > now) || (end && end < now)) {
				code = -1;
			}else {
				code = 1;
				msg = 'success';
				username = user.username;
				this.setToken({
					userId: user.userId,
					username: user.username
				});
			}
		}
		this.ctx.body = {
			code: code,
			message: msg,
			response: {
				username:username,
				operations:opList
			}
		};
	}

	/**
	 * 将token保存在header中
	 * @param {[object]} payload [token保存的内容]
	 */
	setToken(payload) {
		const token = app.jwt.sign(payload, app.config.jwt.secret, {
			expiresIn: app.config.jwt.exp
		});
		this.ctx.set('token', token);
	}

	/**
	 * 添加用户
	 * @param {[string]} username 用户名
	 * @param {[string]} password 密码
	 * @param {[string]} email 邮箱
	 * @param {[date]} startDate 开始时间
	 * @param {[date]} endDate 结束时间
	 * @param {[string]} realname 用户名
	 * @param {[boolean]} islock 用户是否启用
	 *
	 * @return {[int]} code 1添加成功 0添加失败
	 */
	async create() {
		const rule = {
			username: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			email: {
				type: 'email',
				required: false,
				allowEmpty: true
			},
			startDate: {
				type: 'date',
				required: false,
				allowEmpty: true
			},
			endDate: {
				type: 'date',
				required: false,
				allowEmpty: true
			}
		};
		this.ctx.validate(rule);
		const rs = await this.service.user.create(this.ctx.request.body)
		if(rs) {
			this.ctx.body = {
				code: 1,
				message: 'success'
			}
		}
	}	
	/**
	 * 验证邮箱或有户名的唯一性
	 * @return {[string]} username或email
	 * @return {[int]} 1表示有效
	 */
	async unique() {
		const { field, value, id } = this.ctx.request.body;
		let unique = true;
		if(field == 'username') {
			unique = await this.uniqueUsername(value, id);
		}else if(field == 'email') {
			unique = await this.uniqueEamil(value, id);
		}
		this.ctx.body = {
			unique: unique
		}
	}
	/**
	 * 验证用户名唯一性
	 */
	async uniqueUsername(username, id) {
		const user = await this.ctx.service.user.find({
			username: username
		}, false);
		if(user && user.id != id) {
			return false;
		}else {
			return true;
		}
	}

	/**
	 * 验证邮箱唯一性
	 */
	async uniqueEamil(email, id) {
		const user = await this.ctx.service.user.find({
			email: email
		}, false);
		if(user && user.id != id) {
			return false;
		}else {
			return true;
		}
	}

	/**
	 * 修改用户
	 * @returns {int} code 1表示修改成功 0表示修改失败
	 */
	async update() {
		const id = this.ctx.params.id;
		if(!id) {
			this.ctx.body = {
				code: 0,
				message: 'id号不存在'
			}
			return;
		}
		const rule = {
			username: {
				type: 'string',
				required: false,
				allowEmpty: false
			},
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			email: {
				type: 'email',
				required: false
			},
			startDate: {
				type: 'date',
				required: false
			},
			endDate: {
				type: 'date',
				required: false
			}
		};
		this.ctx.validate(rule);
		const rs = await this.ctx.service.user.update({id, updates: this.ctx.request.body});
		if(rs && rs[0] > 0 || rs > 0) {
			this.ctx.body = {
				code: 1,
				message: 'success'
			}
		}else {
			this.ctx.body = {
				code: 0,
				message: '该id号对应的用户不存在'
			}
		}
	}

	/**
	 * 删除用户
	 * @returns {int} code 1表示删除成功, 0表示删除失败
	 */
	async destroy() {
		const id = this.ctx.params.id;
		if(!id) {
			this.ctx.body = {
				code: 0,
				message: 'id号不存在'
			}
			return;
		}
		const rs = await this.ctx.service.user.destroy(id);
		if(rs > 0) {
			this.ctx.body = {
				code: 1,
				message: "success"
			}
		}else {
			this.ctx.body = {
				code: 0,
				message: '该id号对应的用户不存在'
			}
		}
	}

	/**
	 * token校验
	 * @returns {int} code 1表示token有效 0表示token无效
	 */
	async verify() {
		const token = this.ctx.get('token');
		if (token) {
			const decoded = app.jwt.verify(token, app.config.jwt.secret);
			this.setToken({
				userId: decoded.userId,
				username: decoded.username
			});
			this.ctx.body = {
				code: 1,
				message: 'success'
			};
		} else {
			this.ctx.body = {
				code: 0,
				message: 'token值不存在，请先登录'
			}
		}
	}

	/**
	 * 修改密码
	 */
	async modifyPass() {
		const { username, oldpass, newpass } = this.ctx.request.body;
		let userIns = await this.ctx.service.user.find({
			username: username,
			password: oldpass
		});
		if(!userIns || !userIns.id) {
			this.ctx.body = {
				code: 0,
				message: '当前密码不正确，请重试'
			}
			return;
		}
		let updates = {
			password: newpass
		};
		const rule = {
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		};
		this.ctx.validate(rule, updates);
		const rs = await this.ctx.service.user.update({id: userIns.id, updates: updates});
		if(rs && rs[0] > 0 || rs > 0) {
			this.ctx.body = {
				code: 1,
				message: 'success'
			}
		}else {
			this.ctx.body = {
				code: 0,
				message: '暂时无法修改，请稍后再试'
			}
		}
	}
}
module.exports = UserController;