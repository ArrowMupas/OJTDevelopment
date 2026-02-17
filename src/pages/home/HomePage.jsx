import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setTodos(data);
    }

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTodo, completed: false }])
      .select();

    if (error) console.error(error);
    else setTodos((prev) => [...prev, ...data]);

    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) console.error(error);
    else {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo..."
          className="input input-bordered flex-1"
        />
        <button onClick={addTodo} className="btn btn-primary ">
          Add
        </button>
      </div>

      {/* Todo list */}
      {todos.length === 0 ? (
        <p>No todos yet!</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>{todo.title}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-sm btn-error"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
