import { useState } from "react";

import { HistoryTab } from "@/features/history/components/HistoryTab";
import { MyHabitsTab } from "@/features/my-habits/components/MyHabitsTab";
import { TabButton, ToastContainer } from "@/shared/components";

type Tab = "my-habits" | "history";

export function ManageWindowRoot() {
  const [activeTab, setActiveTab] = useState<Tab>("my-habits");

  return (
    <div className="flex h-screen flex-col bg-surface text-white">
      <div className="flex border-b border-border" role="tablist">
        <TabButton active={activeTab === "my-habits"} onClick={() => setActiveTab("my-habits")}>
          My Habits
        </TabButton>
        <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>
          History
        </TabButton>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "my-habits" ? <MyHabitsTab /> : <HistoryTab />}
      </div>
      <ToastContainer />
    </div>
  );
}
