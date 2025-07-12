import { Link, Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Home, BookOpen, Trash2, HelpCircle } from "lucide-react";
import Dashboard from "./dashboard/dashboard";

function Works() {
  return <div><h2 className="text-2xl font-bold mb-4">我的创作</h2></div>;
}
function Recycle() {
  return <div><h2 className="text-2xl font-bold mb-4">回收站</h2></div>;
}
function Help() {
  return <div><h2 className="text-2xl font-bold mb-4">使用教程</h2></div>;
}

const menu = [
  { key: "dashboard", label: "首页", icon: Home, path: "/home/dashboard" },
  { key: "works", label: "我的创作", icon: BookOpen, path: "/home/works" },
  { key: "recycle", label: "回收站", icon: Trash2, path: "/home/recycle" },
  { key: "help", label: "使用教程", icon: HelpCircle, path: "/home/help" },
];

export default function HomePage() {
  const location = useLocation();
  const selected = menu.find(item => location.pathname.startsWith(item.path))?.key || "dashboard";

  // 顶部栏
  const TopBar = (
    <div className="flex items-center justify-between h-16 px-8 border-b bg-white">
      <div className="text-xl font-bold">
        {/* Hi，欢迎来到 <span className="text-[#ffb800]">GenstoryAI!</span> */}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
        <Avatar>
          <AvatarImage src="/avatars/user.jpg" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );

  // 侧边栏
  const SideBar = (
    <div className="w-60 min-h-screen bg-[#f6f8fa] border-r flex flex-col">
      <div className="flex items-center h-16 px-6 font-bold text-lg">
        <img src="../../assets/logo.png" alt="" className="w-8 h-8 mr-2" />
        GenStoryAI
      </div>
      <div className="flex-1 flex flex-col gap-1 mt-4">
        {menu.map(item => (
          <Button
            key={item.key}
            asChild
            variant={selected === item.key ? "secondary" : "ghost"}
            className="justify-start px-6 py-3 rounded-none text-base font-medium"
          >
            <Link to={item.path}>
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      {SideBar}
      <div className="flex-1 flex flex-col">
        {TopBar}
        <div className="flex-1 p-0 bg-[#f6f8fa]">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="works" element={<Works />} />
            <Route path="recycle" element={<Recycle />} />
            <Route path="help" element={<Help />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}