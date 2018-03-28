module.exports = app => {
	const { STRING } = app.Sequelize;

	const RoleResOperation = app.model.define('role_res_operation', {
		resKey: {
			type: STRING,
			//unique: 'compositeIndex'
		},
		opKey: {
			type: STRING,
		//	unique: 'compositeIndex'
		}
	}, {
		timestamps: true,
		underscored: false,
		freezeTableName: true,
		tableName: 'role_res_operation',
		comment: '角色权限表'
	});
	RoleResOperation.associate = function(){
		RoleResOperation.belongsTo(app.model.Role);
	}

	return RoleResOperation;
}