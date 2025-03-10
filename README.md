# Task-manager

## Description

This is a simple project that creates an api that can be used to implement a simple taskmanager.
This project makes use of express and sqlite to create an api and connect to ta database.

This api has the following endpoints:
1. POST /api/users/signup this endpoint allows you to register a user with an email and password
2. POST /api/users/login this endpoint allows you to login with their credentials will generate a jwt token for other endpoints
3. POST /api/tasks/create This will create a new task. You can pass the following in the body to create the task: title, description,dueDate, priority, status, tags
4. GET /api/tasks/:id This will return a task with the provided id, it will also return the tags and the assigned user
5. POST /api/tasks/:id/update This will allow you to update a task. You can provide new details for: title, description,         dueDate,priority or status
6. GET /api/tasks/user This will return all taks either create by or assigned to  the logged in user
7. DELETE /api/tasks/:id This will delete a task based on the id
8. POST /api/tasks/:id/assign This will assign a task to a user based on a provided user id
9. POST /api/tasks/tag This will create a new tag but wont assign it to a task
10. POST /api/tasks/:id/tags This will assign a tag to a task, if the tag doesnt exist it will be created
11. DELETE /api/tasks/:id/tags/:tagId This will remove a tag from a task but wont delete the tag
12. DELETE /api/tasks/tags/:id This will delete a tag and remove it from tasks associated with it
13. GET /api/tasks/filter/:status This will return a list of user tasks with the provided status
14. GET /api/tasks/sort/:field/:order This will return a list of user tasks that have been sorted
15. GET /filter/:status/sort/:field/:order THis allows for both soring and filtering to be performed at once

# Scripts
In package.json there have been several scripts that have been defined to achieve various  goals:

1. npm run init This should be the first script run after cloning and npm install. It will generate a .env file with the jwt secret key. 
2. npm run init-db This is simlar to the above script but it will also remove the db file
3. npm run lint This will just perform linting on the files in the src folder
4. npm run dev This will start the server and allow for the api to be used
5. npm run test This will allow for the test cases to be executed

# Running the api
Once the server has started you can import the postman collection into postman and the requests will be created for yyou along with samples. I recommend creating an environment variable called token so that you dont have to update each request after logging in and can instead just update the value of the variable

# Testing
As mentioned before there are test cases created. The test cases only cover one success and one failure per endpoint. In the tests we mock the db operations rather than the services to allow for more improved test coverage.

# Possible future improvements

- In order to improve scalability and response times we can implement caching. You  will see that some code regarding redis caching cmmented out just to give an example.
- Another way to improve scalability is to implement multiple pods should the code be deployed (in kubernetes for example) or to limit the amount of requests a pod can process at a time
- Errors can be refined to align better with a users experience rather than defaulting to 500
- Tools like Sentry and elasticsearch can be utilised for error monitoring and alerting
- Instead of reading keys from the .env file we could make use of tools like AWS Secret Store for more secure storage