import { BottomNav } from "@/components/shared/BottomNav";
import { Sidebar } from "@/components/shared/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:ml-[72px] lg:ml-[240px]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
