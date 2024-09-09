'use client';

import { useState, useEffect } from 'react';
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { CalendarIcon, EllipsisVerticalIcon, StarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const supabaseURL = 'https://qqvixeumuvnmkxhdpyio.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase: SupabaseClient = createClient(supabaseURL, supabaseKey);

interface Todo {
  id: number;
  description: string;
  created_at: string;
  user_id: string;
  complate: boolean;
  important: boolean;
}

function getLightColor() {
  const r = Math.floor(Math.random() * 127 + 128);
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Complete() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<{ [key: number]: string }>({});
  const [deletionSuccessMessage, setDeletionSuccessMessage] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      const { data, error }: { data: Todo[] | null; error: PostgrestError | null } = await supabase
        .from('todos')
        .select('*')
        .eq('complate', true); 

      if (error) {
        console.error("Error fetching completed todos:", error.message);
        setError(error.message);
      } else {
        const newColors = data?.reduce((acc, todo) => {
          acc[todo.id] = getLightColor();
          return acc;
        }, {} as { [key: number]: string });

        setColors(newColors || {});
        setTodos(data || []);
      }
    };

    fetchCompletedTodos();
  }, []);

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const { data, error }: { data: Todo[] | null; error: PostgrestError | null } = await supabase
        .from('todos')
        .update({ complate: !todo.complate })
        .eq('id', id)
        .select();

      if (error) {
        console.error("Error updating task:", error.message);
      } else {
        const updatedTodo = data?.[0];
        if (updatedTodo) {
          setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
        }
      }
    }
  };

  const handleToggleImportance = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const { data, error }: { data: Todo[] | null; error: PostgrestError | null } = await supabase
        .from('todos')
        .update({ important: !todo.important })
        .eq('id', id)
        .select();

      if (error) {
        console.error("Error updating task:", error.message);
      } else {
        const updatedTodo = data?.[0];
        if (updatedTodo) {
          setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
        }
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    const { error }: { error: PostgrestError | null } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting task:", error.message);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
      setDeletionSuccessMessage("Task deleted successfully!");
      setTimeout(() => setDeletionSuccessMessage(null), 3000); // Clear message after 3 seconds
    }
  };

  const handleEditTask = async (id: number, newDescription: string) => {
    const { data, error }: { data: Todo[] | null; error: PostgrestError | null } = await supabase
      .from('todos')
      .update({ description: newDescription })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      const updatedTodo = data?.[0];
      if (updatedTodo) {
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      }
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(prevId => prevId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] h-full p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 pt-4">Completed Tasks</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="relative p-4 shadow-md rounded-lg flex flex-col justify-between"
              style={{
                backgroundColor: colors[todo.id],
                height: '200px',
                width: '200px',
              }}
            >
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-black" />
                <span className="text-sm text-black">{new Date(todo.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-col items-center justify-center h-full overflow-hidden">
                <span className="text-lg font-medium text-black text-center truncate" style={{ maxWidth: '80%' }}>
                  {todo.description}
                </span>
              </div>

              <button
                onClick={() => toggleDropdown(todo.id)}
                className="absolute bottom-2 right-2 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
              >
                <EllipsisVerticalIcon className="w-5 h-5 text-black" />
              </button>

              {openDropdownId === todo.id && (
                <div
                  className="absolute bottom-12 right-2 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                >
                  <button
                    onClick={() => handleToggleComplete(todo.id)}
                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                  >
                    {todo.complate ? (
                      <>
                        <CheckCircleIconSolid className="w-4 h-4 inline mr-2 text-green-500" /> 
                        Complete
                      </>
                    ) : (
                      <>
                        <CheckCircleIconOutline className="w-4 h-4 inline mr-2 text-gray-400" /> 
                        Complete
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleToggleImportance(todo.id)}
                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                  >
                    {todo.important ? (
                      <>
                        <StarIcon className="w-4 h-4 inline mr-2 text-yellow-500" /> 
                        Important
                      </>
                    ) : (
                      <>
                        <StarIcon className="w-4 h-4 inline mr-2 text-gray-400" />
                        Important
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleEditTask(todo.id, prompt('Edit task description:', todo.description) || todo.description)}
                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                  >
                    <PencilIcon className="w-4 h-4 inline mr-2" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteTask(todo.id)}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  >
                    <TrashIcon className="w-4 h-4 inline mr-2 text-red-600" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {deletionSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          {deletionSuccessMessage}
        </div>
      )}
    </div>
  );
}
