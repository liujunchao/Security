const Controller = require('egg').Controller;

class RoleController extends Controller {
	/**
	 * 获取角色列表
	 * @returns {array} 角色列表
	 */
	async index() {
		const roles = await this.ctx.service.role.index();
		this.ctx.body = {
			code: 1,
			response: roles
		}
	}
	/**
	 * 获取单个角色对象
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
		const role = await this.ctx.service.role.show(id);
		this.ctx.body = {
			code: 1,
			response: role
		}
	}

	/**
	 * 添加角色
	 * @param {string} name 角色名
	 * @returns {int} code 1表示添加角色成功 0添加角色失败
	 */
	async create() {
		const rule = {
			name: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		}
		this.ctx.validate(rule);
		const role = await this.ctx.service.role.create(this.ctx.request.body);
		if(role) {
		this.ctx.body = {
			code: 1,
			message: 'success'
		}
		}else {
		this.ctx.body = {
			code: 0,
			message: '角色添加失败'
		}
		}
	}

	/**
	 * 修改角色
	 * @param {string} name 需要修改的角色名
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
			name: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		}
		this.ctx.validate(rule);
		const rs = await this.ctx.service.role.update({id, updates: this.ctx.request.body});
		if(rs && rs[0] > 0 || rs > 0) {
			this.ctx.body = {
				code: 1,
				message: 'success'
			}
		}else {
			this.ctx.body = {
				code: 0,
				message: '该id号对应的角色不存在'
			}
		}
	}

	/**
	 * 删除角色
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
		const rs = await this.ctx.service.role.destroy(id);
		if(rs > 0) {
			this.ctx.body = {
				code: 1,
				message: "success"
			}
		}else {
			this.ctx.body = {
				code: 0,
				message: '该id号对应的角色不存在'
			}
		}
	}

	/**
	 * 给角色指派用户
	 * @params {int} roleId 角色id号
	 * @params {array} userIds 用户id号 eg: [{id: 1}, {id: 2}]
	 * @returns {int} code 1表示设置成功, 0表示设置失败
	 */
	async setUsers() {
		const { roleId, userIds } = this.ctx.request.body;
		if(!roleId) {
			this.ctx.body = {
				code: 0,
				message: 'roleId不存在'
			}
			return;
		}
		if(!Array.isArray(userIds)) {
			this.ctx.body = {
				code: 0,
				message: '参数格式不对，userIds必须以用户id数组的形式传入'
			}
			return;
		}
		const rs = await this.ctx.service.role.setUsers(roleId, userIds);
		if(rs) {
			this.ctx.body = {
				code: 1,
				message: 'success'
			}
		}else {
			this.ctx.body = {
				code: 0,
				message: '未找到相应的角色'
			}
		}
	}

	/**
	 * 获取角色映射的用户数组
	 */
	async getUsers() {
		const roleId = this.ctx.query.roleId;
		if(!roleId) {
			this.ctx.body = {
				code: 0,
				message: 'roleId不存在'
			}
			return;
		}
		const users = await this.ctx.service.role.getUsers(roleId);
		this.ctx.body = {
			code: 1,
			response: users
		}
	}

	/**
	 * 验证角色名唯一性
	 * @return {[string]} name
	 * @return {[int]} 1表示有效
	 */
	async unique() {
		const { value, id } = this.ctx.request.body;
		let unique = true;
		const role = await this.ctx.service.role.find({
			name: value
		});
		if(role && role.id != id) {
			unique = false;
		}else {
			unique = true;
		}
		this.ctx.body = {
			unique: unique
		}
	}
}
module.exports = RoleController;