const Service = require('egg').Service;

class RoleService extends Service {
	async index() {
		return await this.ctx.model.Role.findAll();
	}
	async show(id) {
		return await this.ctx.model.Role.findById(id);
	}
	async create(param) {
		return await this.ctx.model.Role.create(param);
	}
	async update({id, updates}) {
		return await this.ctx.model.Role.update(updates, {
			where: {
				id: id
			}
		});
	}
	async destroy(id) {
		return await this.ctx.model.Role.destroy({
			where: {
				id: id
			}
		});
	}
	async find(param) {
		return await this.ctx.model.Role.findOne({
	        where: param
	    });
	}
	async setUsers(id, userIds) {
		const roleIns = await this.ctx.model.Role.findById(id);
		if(roleIns) {
			let users = this.ctx.model.User.build(userIds);
			roleIns.setUser(users);
		}
		return roleIns;
	}

	async getUsers(id) {
		const roleIns = await this.ctx.model.Role.findById(id);
		return  await roleIns.getUser();
	}
}
module.exports = RoleService;
