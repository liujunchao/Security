module.exports = app => {
	const Role = app.model.define('role', {
		name: {
			type: app.Sequelize.STRING,
			allowNull: false,
			unique: true
		}
	}, {
		timestamps: true,
		underscored: false,
		freezeTableName: true,
		tableName: 'role',
		comment: '角色表'
	});
	Role.associate = function() {
		app.model.Role.hasMany(app.model.RoleResOperation, {as: 'RoleResOperation'});
		app.model.Role.belongsToMany(app.model.User, {
			as: 'user',
			through: 'role_user_mapping'
		});
	}

	return Role;
}