'use client';

import { useState, useEffect } from "react";
import { createClient, SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

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

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error }: { data: Todo[] | null; error: PostgrestError | null } = await supabase
        .from('todos')
        .select('*');

      if (error) {
        console.error("Error fetching todos:", error.message);
        setError(error.message);
      } else {
        setTodos(data || []);
      }
    };

    fetchTodos();
  }, []);

  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.complate).length;
  const importantTasks = todos.filter(todo => todo.important).length;
  const inProgressTasks = todos.filter(todo => !todo.complate).length;

  const chartData = {
    labels: ['Completed', 'Important', 'In Progress'],
    datasets: [
      {
        data: [completedTasks, importantTasks, inProgressTasks],
        backgroundColor: ['#4CAF50', '#FFC107', '#FF5722'],
        borderColor: ['#388E3C', '#F57F17', '#E64A19'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 pt-4">Dashboard</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Metrics</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
            <h3 className="text-lg font-medium">Total Tasks</h3>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
            <h3 className="text-lg font-medium">Completed</h3>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
            <h3 className="text-lg font-medium">Important</h3>
            <p className="text-2xl font-bold">{importantTasks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
            <h3 className="text-lg font-medium">In Progress</h3>
            <p className="text-2xl font-bold">{inProgressTasks}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[300px] h-auto">
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
