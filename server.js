const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

let todos = [];
if (fs.existsSync('todos.json')) {
  todos = JSON.parse(fs.readFileSync('todos.json'));
}

function saveTodos() {
  fs.writeFileSync('todos.json', JSON.stringify(todos));
}

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  let html = `<!DOCTYPE html><html><head><title>Todo App</title><style>body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial; margin: 0; padding: 20px; min-height: 100vh; }.container { max-width: 600px; margin: 50px auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }h1 { color: #667eea; text-align: center; }input { padding: 12px; width: 70%; border: 2px solid #667eea; border-radius: 5px; }button { padding: 12px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }li { padding: 12px; margin: 8px 0; background: #f8f9fa; border-radius: 8px; list-style: none; }a { color: #ff4757; text-decoration: none; float: right; font-weight: bold; }</style></head><body><div class="container"><h1>My Todos</h1><ul>`;
  todos.forEach(todo => {
    html += `<li>${todo.task} <a href="/delete?id=${todo.id}">Delete</a></li>`;
  });
  html += `</ul><form method="POST" action="/add"><input name="task" placeholder="New todo"><button>Add</button></form></div></body></html>`;
  res.send(html);
});

app.post('/add', (req, res) => {
  const task = req.body.task;
  todos.push({id: Date.now(), task});
  saveTodos();
  res.redirect('/');
});

app.get('/delete', (req, res) => {
  const id = parseInt(req.query.id);
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});