const homedir = require('os').homedir
const home = process.env.HOME || homedir
var inquirer = require('inquirer');
const p = require('path')
const db = require('./db')
const dbPath = p.join(home, '.todo')
module.exports.add = async (title) => {
    const list = await db.read()
    list.push({ title: title, done: false })
    db.write(list, dbPath)
}

module.exports.clear = async (title) => {
    await db.write([])
}
module.exports.showAll = async () => {
    const list = await db.read()
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择任务?',
                choices: [{ name: "退出", value: "-1" }, ...list.map((task, index) => {
                    return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString() }
                }), { name: "创建任务", value: "-2" }]
            },
        ])
        .then((answer) => {
            const index = parseInt(answer.index)
            console.log(answer.index);
            if (index >= 0) {
                //选择
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'action',
                            message: '请选择操作?',
                            choices: [
                                { name: "退出", value: "exit" },
                                { name: "已完成", value: "done" },
                                { name: "未完成", value: "undone" },
                                { name: "修改标题", value: "update" },
                                { name: "删除", value: "remove" }
                            ]
                        },
                    ]).then(answer2 => {
                        switch (answer2.action) {
                            case 'exit':
                                break
                            case 'done':
                                list[index].done = true
                                db.write(list)
                                break
                            case 'undone':
                                list[index].done = false
                                db.write(list)
                                break
                            case 'update':
                                const questions = [
                                    {
                                        type: 'input',
                                        name: 'title',
                                        message: "新的任务名",
                                        default() {
                                            return list[index].title;
                                        },
                                    },]

                                inquirer.prompt(questions).then((answer3) => {
                                    list[index].title = answer3.title
                                    db.write(list)
                                });
                                break
                            case 'remove':
                                list.splice(index, 1)
                                db.write(list)
                                break
                        }

                    })
            } else if (index === -2) {
                //创建任务
                const questions = [
                    {
                        type: 'input',
                        name: 'title',
                        message: "新的任务名",
                    },]

                inquirer.prompt(questions).then((answer4) => {
                    list.push({ title: answer4.title, done: false })
                    db.write(list)
                });
            }
        });
}