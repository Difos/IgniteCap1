const express = require('express');
const app = express();
const { v4: uuidv4 } = require("uuid");

app.use(express.json());

app.listen(3333);


const users = [];

function checksExistsUserAccount(request, response, next) {
    const { username } = request.headers;

    const user = users.find((user) => user.username === username);

    if (!user) {
        return response.status(404).json({ error: "user not found!" });
    }

    request.user = user;

    return next();
}

app.post('/users', (request, response) => {
    const { username, name } = request.body;

    console.log(username, name);
    const userAlreadyExists = users.some((user => user.username === username));

    if (userAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" });
    }

    users.push({
        id: uuidv4(),
        name,
        username,
        todos: []
    });

    return response.status(201).send();
});

app.get('/users', (request, response) => {

    return response.json(users);

});


app.get('/todos', checksExistsUserAccount, (request, response) => {
    const { user } = request;

    return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

    const { title, deadline } = request.body;
    const { user } = request;

    const todoOperation = {
        id: uuidv4(),
        title,
        deadline: new Date(deadline),
        done: false,
        created_at: new Date()
    }

    user.todos.push(todoOperation);

    return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const { user } = request;
    const { title, deadline } = request.body;
    const { id } = request.params;

    const todo = user.todos.find((todo) => todo.id === id);

    if (todo) {
        todo.title = title;
        todo.deadline = new Date(deadline);
    }else{
        return response.status(400).json({ error :"todo not found"});
    }


    return response.status(201).json();
});


app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const {user} = request;
    const {id} = request.params;

    const todo = user.todos.find((todo) => todo.id === id);

    if (!todo) {
        return response.status(400).json({ error :"todo not found"});
    }

    todo.done = true;

    return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const {user} = request;
    const {id} = request.params;

    const todo = user.todos.findIndex((todo)=> todo.id === id);

    if(todo ===-1) {
        return response.status(400).json({ error :"todo not found"});
    }

    user.todos.splice(todo,1);

    return response.status(204).json().send();
});

module.exports = app;
