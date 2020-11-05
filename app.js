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
log('Let\'s generate an html profile page for your team!\nWe\'ll start with the MANAGER...');

// First, prompt them for info to create a manager
inquirer.prompt(managerPrompts)
.then(answers => {
    let employee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
    employees.push(employee);
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
            log('Let\'s add an ENGINEER...');
            inquirer.prompt(engineerPrompts)
            .then(answers => {
                let newEngineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                employees.push(newEngineer);
                addTeamMembers();
            })
            .catch(err => log(chalk.red(err)));
        } else if (response.add === "Yes, an Intern!") {
            log('Let\'s add an INTERN...');
            inquirer.prompt(internPrompts)
            .then(answers => {
                let newIntern = new Intern(answers.name, answers.id, answers.email, answers.school);
                employees.push(newIntern);
                addTeamMembers();
            })
            .catch(err => log(chalk.red(err)));
        } else {
            // After the user has input all employees desired, call the `render` function (required
            // above) and pass in an array containing all employee objects; the `render` function will
            // generate and return a block of HTML including templated divs for each employee!
            log(employees);
            const htmlText = render(employees);
            fs.writeFile(outputPath, htmlText, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            // After you have your html, you're now ready to create an HTML file using the HTML
            // returned from the `render` function. Now write it to a file named `team.html` in the
            // `output` folder. You can use the variable `outputPath` above target this location.
            // Hint: you may need to check if the `output` folder exists and create it if it
            // does not.

        }        
    })        
}     

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
