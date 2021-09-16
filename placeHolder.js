// Create an array used to display role choices.
db.query('SELECT * FROM role', (err, roles) => {
  if (err) { console.log(err) }
  else {
    let roleChoices = roles.map(role => role.title)

    prompt([
      {
        type: 'input',
        name: 'first_name',
        message: `Enter the employee's first name: `
      },
      {
        type: 'input',
        name: 'last_name',
        message: `Enter the employee's last name: `
      },
      {
        type: 'list',
        name: 'roleChoice',
        message: 'What role does this employee hold?',
        choices: roleChoices
      },
      {
        type: 'confirm',
        name: 'hasManager',
        message: 'Does this employee have a manager? (y/n): '
      }
    ])
      .then(({ first_name, last_name, roleChoice, hasManager }) => {
        // Filter new array that matches the selected department to it's object.
        roleChoice = roles.filter(role => role.title === roleChoice)

        // Create a new department object to insert into the table.
        let newEmployee = {
          first_name: first_name,
          last_name: last_name,
          role_id: roleChoice[0].id
        }