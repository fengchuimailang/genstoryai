import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileText, Star, MoreVertical, Grid, List, Search, Bell } from "lucide-react";
import { useState } from "react";

const stats = [
  { value: "5", unit: "天", label: "制作天数", highlight: true },
  { value: "1.8", unit: "万", label: "总字数" },
  { value: "18", unit: "天", label: "作品数" },
  { value: "5", unit: "天", label: "rectangle" },
];

const works = [
  { name: "午夜拉面里的秘密", time: "2025-01-01 18:23" },
  { name: "当最后一颗番茄落在生锈的铁门上时", time: "2025-01-01 18:23" },
  { name: "穿过第七个青萝才能抵达的遗忘之城", time: "2025-01-01 18:23" },
];

export default function HomePage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f8fa]">
      {/* 顶部欢迎区 */}
      <div className="flex justify-between items-center px-10 pt-8 pb-2">
        <div>
          <h1 className="text-3xl font-bold">
            Hi，欢迎来到 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb800] to-[#ff7a00]">GenstoryAI!</span>
          </h1>
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

      {/* 创作看板 */}
      <div className="px-10 mt-2">
        <h2 className="text-lg font-semibold mb-4">创作看板</h2>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-xl shadow-none border border-[#f0f0f0] bg-white">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className={`text-3xl font-extrabold ${stat.highlight ? "text-[#2196f3]" : "text-gray-900"}`}>
                  {stat.value}
                  <span className="text-base font-normal ml-1">{stat.unit}</span>
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* 大的“开始创作”按钮卡片 */}
        <Card className="rounded-xl mt-6 bg-[#22b07d] border-none shadow-none">
          <CardContent className="flex items-center justify-center py-12">
            <Button size="lg" className="bg-transparent text-white text-2xl font-bold hover:bg-[#1a8c63] flex items-center gap-2">
              <span className="text-3xl">+</span> 开始创作
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 我的作品 */}
      <div className="px-10 mt-10">
        <Card className="rounded-xl border-none shadow-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">我的作品</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-40">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索"
                  className="w-full h-8 text-sm bg-[#f6f8fa] border border-[#e5e7eb] rounded-md pl-8"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-md"
                onClick={() => setView("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-md"
                onClick={() => setView("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex font-semibold text-gray-500 text-sm mb-2">
              <div className="flex-1">作品名称</div>
              <div className="w-48 text-center">最近编辑时间</div>
              <div className="w-32 text-center">操作</div>
            </div>
            {works
              .filter(w => w.name.includes(search))
              .map((work, i) => (
                <div key={i} className="flex items-center py-2 hover:bg-gray-50 rounded-lg group">
                  <div className="flex-1 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#22b07d]" />
                    <span className="text-gray-900">{work.name}</span>
                  </div>
                  <div className="w-48 text-center text-gray-400 text-sm">{work.time}</div>
                  <div className="w-32 flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="h-10" />
    </div>
  );
}