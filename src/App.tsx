import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

//Todo is the table that houses the Todos, column is contnt
function App() {
  const [todos, setTodos] = useState<Array<Schema["StockAlertTable"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  useEffect(() => {
    client.models.StockAlertTable.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.StockAlertTable.create({ content: window.prompt("Add Ticker") });
  }

  function deleteTodo(id: string) {
    client.models.StockAlertTable.delete({ id })
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>Enter Stock Ticker</button>
      <ul>
        {todos.map((todo) => (
          <li
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}


export default App;
