const Service = require('egg').Service;

class RoleResService extends Service {
	async getAllResources(roleId) {
		const role = await this.ctx.model.Role.findById(roleId);
		const roleResOp = await this.ctx.model.RoleResOperation.findAll({
			where: {
				roleId: roleId
			}
		});
		return {
			role: role,
			operations: roleResOp
		};
	}
	async recreateResources(roleId, funList) {
		await this.ctx.model.RoleResOperation.destroy({
			'where': { roleId: roleId }
		})
		const role = await this.ctx.model.Role.findById(roleId);
		for (let fun of funList) {
			for (let op of fun.operations) {
				if (op.isAuthorized) {
					let rpIns = await this.ctx.model.RoleResOperation.create({ resKey: fun.key, opKey: op.key})
					await role.addRoleResOperation(rpIns);
				}
			}
		}
	}

}

module.exports = RoleResService;