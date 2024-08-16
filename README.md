# Claims Gate Developer Assessment Project

## Outline

This project template is intended for use by software engineers looking to join the Claims Gate team. Below you will find all relevant requirements and information to be able to complete the project. Should you have any questions or need further clarification, please contact max.raju@claimsgate.co.uk.

### Expected outcomes

Key areas that will be assessed include:

- The project compiles and loads without errors
- Code is well organized and easily readable and utilizes modern JS features as well as effective use of TypeScript
- The project works on mobile
- Requirements are clearly met

## Project requirement

There is a need for a new block in our on-boarding form. Blocks are components used in an on-boarding form to collect data from claimants. A single block can contain multiple input elements, run logic, validations and more.

The block needs to collect an address history for up to 3 years ago to a maximum of 3 addresses. It need only store address line 1, postcode, and date moved in for each address.

The postcode input should support autocomplete using an api from https://postcodes.io/ to improve the user experience.

- The block should prevent form submission if an address has not been entered.
- The block should not let the form submit if the user has not provided more than 3 years of address history from the time of submission.
- Errors should be rendered as text on the screen above the submit button.

To be able to demonstrate the functionality of this block within the context of an on-boarding form, you will need to use existing text and submit components to render the form and allow for form submission.

### Technical Considerations

- The project must be strongly typed, and the code must be written in TypeScript.
- DRY principles and consistent naming conventions should be applied
- You can use any npm modules you like, however unnecessary use of modules or poor choice of modules will affect the assessment.
- Bootstrap Vue is available as the UI framework
- Bootstrap is available as the CSS framework
- Access to to database and backend services is supported through stubbed services available in the core folder
- Use of any free public API's is allowed to achieve the requirements
- Vue components should be created using the options API. See the text or form components for examples
- The address input elements should use bootstrap vue
- All styling should use bootstrap classes

### Acceptance Criteria

- On Load
  - User data is loaded using functions from the core folder using provided user ID in the url
  - If the user id is not found, a message is displayed and the form is not loaded, as they are not an existing user
  - If the user id is found, the form is loaded and the user's name is displayed
  - The form should have a title text 'Welcome Back {{user.name}}'
  - The form should have a subtitle text 'Please provide you address history for the past 3 years'
  - The form should render a component that allows the user to enter their address history
  - The form should have a button 'Submit'
- On User Interaction
  - The user should be able to enter address line 1, postcode, and date moved in for their current address
  - if the date moved in is less than 3 years ago, the user should be provided with the option to add a second address
  - if the second address move in date is still less than 3 years ago, the user should be able to add a third address
  - The form should not be submitted if the user has not provided more than 3 years of address history from the time of submission
  - [Optional] The postcode input supports autocomplete using an api from https://postcodes.io/ to improve the user experience
  - Errors should be rendered as text on the screen above the submit button using the danger class of text color
  - If the address history is valid, the form should submit
  - On Submit
    - Block is validated
    - If the block is valid, `createClaim` is called
    - If the block is invalid, the form is not submitted and an error message is displayed
    - Users IP address is stored on the claim
    - The form shows a message that the information has been submitted successfully

## Tasks

Some tasks have been listed here, however you will find this is not an exhaustive list.

- There are several 'TODO' comments throughout the project. These are areas where you must make changes to the code. You will also need to make relevant changes to other areas that do not have these comments, as you see fit to meet the requirements.
- On load the app will need to fetch existing user data to be able to display the user's name as well as to be able to create a claim for that user on submission.
- The form will need to fetch the user's IP address and store it on the claim.
- The form should have a title text 'Welcome Back {{user.name}}'
- The form should have a subtitle text 'Please provide you address history for the past 3 years'
- The form should have a button 'Submit'

### Submission

You can choose to create a repo in your own GitHub account and share it, or you can zip the project and send it via email. If emailing please remember to remove any node modules or package-lock.json files before zipping.

You can share your repo with max.raju@claimsgate.co.uk or you can send the zip file to the same email address.
