const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

class ConfigHelper {
    constructor() {
        const cwd = process.cwd(); // 选择目录
        // console.log(`cwd is ${cwd}/`)
        this.targetDir = cwd;
    }

    // 处理配置
    async handleConfig() {

        // 调用下载方法
        const promptList = [{
            type: 'input',
            message: 'please input App ID:',
            name: 'app_id',
            default: "cli_***************"
        }, {
            type: 'input',
            message: 'please input App Secret:',
            name: 'app_secret',
            default: "************************"
        }];

        const { app_id, app_secret } = await inquirer.prompt(promptList)
        if (app_id.length === 0 || app_secret.length === 0) {
            console.log(`\r\n ${chalk.red('Sorry!!! App ID or App Secret is empty!')} please run ${chalk.blue('npm run config')} again!!!`);
            return 0
        }

        const apiList = [{
            type: 'input',
            message: 'please input API Port:',
            name: 'api_port',
            default: "8989"
        }];

        const { api_port } = await inquirer.prompt(apiList)
        if (!api_port || api_port.length === 0) {
            api_port = "8989" //缺省值
        }

        const random_str = this.generateRandomString()
        await this.generateConfigCode(app_id, app_secret, api_port, random_str)
        return 1
    }

    generateRandomString() {    
        const count = 32;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
        for (let i = 0; i < count; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }

    async generateConfigCode(app_id, app_secret, api_port, random_str) {

        // 写入到server的配置中去
        const opt = {
            flag: 'w', // a：追加写入；w：覆盖写入
        }

        let getUserAccessTokenPath = "/api/get_user_access_token"
        let getSignParametersPath = "/api/get_sign_parameters"

        //生成server_config.js代码
        const serverConfigPath = `${this.targetDir}/server/server_config.js`
        if (!fs.existsSync(serverConfigPath)) {
            fs.createFileSync(serverConfigPath)
        }

        const serverConfigContent = `// Code Generated By 'npm run config', Please DO NOT Edit!!!!! 
        \nconst config = {
    appId: \"${app_id}\", \/\/网页应用appId
    appSecret: \"${app_secret}\", \/\/网页应用secret
    getUserAccessTokenPath:  \"${getUserAccessTokenPath}\", \/\/免登-获取user_access_token的api path
    getSignParametersPath:  \"${getSignParametersPath}\", \/\/鉴权-获取鉴权参数的api path
    noncestr: \"${random_str}\",   \/\/随机字符串，用于鉴权签名用
    apiPort: \"${api_port}\",   \/\/后端指定端口
}
    \nmodule.exports = { config : config };`
        await fs.writeFileSync(serverConfigPath, serverConfigContent)


        // 生成clientConfig.js代码
        const clientConfigPath = `${this.targetDir}/src/config/client_config.js`
        if (!fs.existsSync(clientConfigPath)) {
            fs.createFileSync(clientConfigPath)
        }

    const clientConfigContent = `// Code Generated By 'npm run config', Please DO NOT Edit!!!!! 
        \nconst clientConfig = {
    appId: \"${app_id}\", \/\/网页应用appId
    getUserAccessTokenPath:  \"${getUserAccessTokenPath}\", \/\/免登api path
    getSignParametersPath:  \"${getSignParametersPath}\", \/\/鉴权api path;
    apiPort: \"${api_port}\",   \/\/后端指定端口
}
    \nexport default clientConfig;`

        if (!fs.existsSync(clientConfigPath)) {
            fs.createFileSync(clientConfigPath)
        }

        await fs.writeFileSync(clientConfigPath, clientConfigContent)
    }

    async handle() {

        //配置
        const res = await this.handleConfig();
        if (res === 1) {
            console.log(`\r\nGreat!!! We suggest that you begin by typing:`);
            console.log(`\r${chalk.cyan('npm run start')}`);
        }
    }
}

module.exports = ConfigHelper;
