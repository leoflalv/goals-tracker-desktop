import { GoalWidget } from "@/features/goals/components";
import { ToastContainer } from "@/shared/components";

import "./App.css";

function App() {
  return (
    <main className="bg-transparent p-4">
      <GoalWidget />
      <ToastContainer />
    </main>
  );
}

export default App;
