const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const log = console.log;

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const managerPrompts = [
    {type: 'input',
     message: 'Name:',
     name: 'name'}, 
     {type: 'input',
     message: 'ID:',
     name: 'id'}, 
    {type: 'input',
     message: 'Email:',
     name: 'email'}, 
    {type: 'input',
     message: 'Office Number:',
     name: 'officeNumber'}
];

const engineerPrompts = [
    {type: 'input',
     message: 'Name:',
     name: 'name'}, 
     {type: 'input',
     message: 'ID:',
     name: 'id'}, 
    {type: 'input',
     message: 'Email:',
     name: 'email'}, 
    {type: 'input',
     message: 'GitHub Username:',
     name: 'github'}
];

const internPrompts = [
    {type: 'input',
     message: 'Name:',
     name: 'name'}, 
     {type: 'input',
     message: 'ID:',
     name: 'id'}, 
    {type: 'input',
     message: 'Email:',
     name: 'email'}, 
    {type: 'input',
     message: 'School:',
     name: 'school'}
];

const employees = [];

// Intro
log(chalk.inverse(' ********************************** '));
log(chalk.inverse(' *     Team Profile Generator     * '));
log(chalk.inverse(' ********************************** '));
log('Let\'s generate an html profile page for your team!\nWe\'ll start with the team manager...');
log(chalk.cyan('\nAdd Employee:', chalk.bold('Manager')));

// First, prompt them for info to create a manager
inquirer.prompt(managerPrompts)
.then(answers => {
    let employee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
    employees.push(employee);
    log(chalk.green("Manager added!\n"));
    // Once the manager is added to the employees array, call a function that asks if they want to add anyone else until they say no, then calls the htmlRenderer.
    addTeamMembers();
})    
.catch(err => log(chalk.red(err)));

function addTeamMembers() {
    inquirer.prompt([{type: "list",
    message: "Do you want to add another team member?",
    name: "add", 
    choices: ["Yes, an Engineer!", "Yes, an Intern!", "No, I'm done adding team members."]}])
    .then(response => {
        if(response.add === "Yes, an Engineer!") {
            log(chalk.cyan('Add Employee:', chalk.bold('Engineer')));
            inquirer.prompt(engineerPrompts)
            .then(answers => {
                let newEngineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                employees.push(newEngineer);
                log(chalk.green("Engineer added!\n"));
                addTeamMembers();
            })
            .catch(err => log(chalk.red(err)));
        } else if (response.add === "Yes, an Intern!") {
            log(chalk.cyan('Add Employee:', chalk.bold('Intern')));
            inquirer.prompt(internPrompts)
            .then(answers => {
                let newIntern = new Intern(answers.name, answers.id, answers.email, answers.school);
                employees.push(newIntern);
                log(chalk.green("Intern added!\n"));
                addTeamMembers();
            })
            .catch(err => log(chalk.red(err)));
        } else {
            // After the user has input all employees desired, call the `render` function and pass in the employees array - the `render` function will return a block of HTML
            
            const html = render(employees);

            // Create a file using the HTML returned from the `render` function and write it to a file named `team.html` in the`output` folder.
            
            fs.writeFile(outputPath, html, (err) => {
                if (err) throw err;
                log(chalk.green.bold('\nSuccess!'));
                log('A team profile html file has been created in the \'output\' folder!');
            });
        }        
    })        
}