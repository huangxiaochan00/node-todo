const { Command } = require('commander');
const api = require('./index')
const program = new Command();
// program
//     .name('string-util')
//     .description('CLI to some JavaScript string utilities')
//     .version('0.8.0');

program
    .option('-d, --debug', 'output extra debugging')
    .option('-s, --small', 'small pizza size')
    .option('-p, --pizza-type <type>', 'flavour of pizza');
program
    .command('add <taskName>')
    .description('add task')
    .action((task, destination) => {
        console.log(`add ${task} success!`);
        api.add(task)
    })
    .command('clear')
    .description('clear task')
    .action((source, destination) => {
        api.clear()
    })

program.parse(process.argv);

if (process.argv.length === 2) {
    api.showAll()
}