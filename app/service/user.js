const Service = require('egg').Service;

class UserService extends Service {
	async index() {
		return await this.ctx.model.User.findAll();
	}
	async show(id) {
		return await this.ctx.model.User.findById(id);
	}
	async create(param) {
		return await this.ctx.model.User.create(param);
	}
	async update({id, updates}) {
		return await this.ctx.model.User.update(updates, {
			where: {
				id: id
			}
		});
	}
	async find(param, bool) {
		return await this.ctx.model.User.findOne({
			where: param,
			paranoid: bool == undefined ? true : bool
		});
	}
	async destroy(id) {
		return await this.ctx.model.User.destroy({
			where: {
				id: id
			}
		});
	}
}

module.exports = UserService;