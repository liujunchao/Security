const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, '../public/');

class ResourcesController extends Controller {
    async submitRoleResConfig(){
        let roleId  = this.ctx.request.body.roleId;
        let operations = this.ctx.request.body.operations;
        try {
                await this.service.roleRes.recreateResources(roleId,operations);
                this.ctx.body =  { code: 1, message: 'success'  };
        } catch(err) {
            this.ctx.body =  { code: -1, message: err.message };
        }
    }
    async getResources() {
        let res = fs.readFileSync(`${basePath}resources.json`, 'utf-8');
        res = JSON.parse(res);
        let descDic = {
            "view":"查看",
            "edit":"编辑",
            "delete":"删除",
            "export":"导出"
        }
        const roleInfo = await this.service.roleRes.getAllResources(this.ctx.query.id);
        let isManager = roleInfo.role.name === "管理员组";
        let keyList = [];
        for(let operation of roleInfo.operations){
            keyList.push(`${operation.resKey}_${operation.opKey}`);
        }
        res = res.filter((itm)=>{
            if(isManager){
                return true;
            }else{
                return itm.key !== "security";
            }
        });
        for(let itm of res){
            
            let opList = [];
            
            for(let op of itm.operations){
                let opKey = op.key;
                let finalKey = `${itm.key}_${opKey}`;
                opList.push({
                    "key":opKey,
                    "name":op.name?op.name:descDic[op.key],
                    "isAuthorized": keyList.indexOf(finalKey)>-1
                });
            }
            itm.operations = opList;
        }
        
        this.ctx.body = {
            operations:res,
            role:roleInfo.role
        }; 
    }
}
module.exports = ResourcesController;
