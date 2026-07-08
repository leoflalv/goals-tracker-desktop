import { HabitWidget } from "@/features/habits/components";
import { ToastContainer } from "@/shared/components";

import "./App.css";

function App() {
  return (
    <main className="bg-transparent p-4">
      <HabitWidget />
      <ToastContainer />
    </main>
  );
}

export default App;
