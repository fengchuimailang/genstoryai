import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileText, Grid, List, Trash2, Edit, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import CreateWorkModal from "./compoments/CreateWorkModal";
import { getStoryList } from '@/api/story-api';
import { toast } from 'sonner';
import { deleteStory } from '@/api/story-api';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/lib/store';
const stats = [
  { value: "5", unit: "天", label: "制作天数", highlight: true },
  { value: "1.8", unit: "万", label: "总字数" },
  { value: "18", unit: "天", label: "作品数" },
  { value: "5", unit: "天", label: "rectangle" },
];

export default function HomePage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 保留total, 因为后续有用到
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<any>(null);
  const navigate = useNavigate();
  const { setCurrentStory } = useStoryStore();

  // 获取故事列表
  const fetchStories = async (params?: { page?: number; search?: string }) => {
    setLoading(true);
    try {
      const skip = ((params?.page ?? page) - 1) * pageSize;
      const limit = pageSize;
      const res = await getStoryList({ skip, limit, search: params?.search ?? search });
      if (Array.isArray(res)) {
        setStories(res);
      } else {
        setStories(res.data || []);
        setTotal(res.total || 0);
        total
      }
    } catch (e) {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories({ page: 1 });
    // eslint-disable-next-line
  }, []);

  // 分页切换
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchStories({ page: newPage });
  };

  // 搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchStories({ page: 1, search: e.target.value });
  };

  // 删除故事
  const handleDeleteStory = async () => {
    if (!storyToDelete) return;
    try {
      await deleteStory(storyToDelete.id);
      toast.success('删除成功');
      setStories(prev => prev.filter(s => s.id !== storyToDelete.id));
      setDeleteDialogOpen(false);
      setStoryToDelete(null);
    } catch (e) {
      toast.error('删除失败');
    }
  };
  return (
    <div className="min-h-screen bg-[#f6f8fa]">
      {/* 顶部欢迎区 */}
      <div className="flex justify-between items-center px-10 pt-8 pb-2">
        <div>
          <h1 className="text-3xl font-bold">
            Hi，欢迎来到 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb800] to-[#ff7a00]">GenstoryAI!</span>
          </h1>
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
            <Button size="lg" className="bg-transparent text-white text-2xl font-bold hover:bg-[#1a8c63] flex items-center gap-2" onClick={() => setModalOpen(true)}>
              <span className="text-3xl">+</span> 开始创作
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 我的作品（渲染 stories） */}
      <div className="px-10 mt-10">
        <Card className="rounded-xl border-none shadow-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">我的作品</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="搜索"
                className="w-40 h-8 text-sm bg-[#f6f8fa] border border-[#e5e7eb] rounded-md"
                value={search}
                onChange={handleSearch}
              />
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
              <div className="w-100 text-center">最近编辑时间</div>
              <div className="w-32 text-center">操作</div>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-400">加载中...</div>
            ) : stories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">暂无数据</div>
            ) : (
              stories.map((story, i) => (
                <div key={story.id || i} className="flex items-center py-2 hover:bg-gray-50 rounded-lg group">
                  <div className="flex-1 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#22b07d]" />
                    <span className="text-gray-900">{story.title}</span>
                  </div>
                  <div className="w-100 text-center text-gray-400 text-sm">{story.version_time}</div>
                  <div className="w-32 flex items-center justify-center gap-2">
                    <button className="text-gray-400 hover:text-red-500" title="删除" onClick={() => { setStoryToDelete(story); setDeleteDialogOpen(true); }}><Trash2 className="w-4 h-4" /></button>
                    <button className="text-gray-400 hover:text-blue-500" title="编辑" onClick={() => { setCurrentStory(story); navigate(`/MainStoryContent?storyId=${story.id}`); }}><Edit className="w-4 h-4" /></button>
                    <button className="text-gray-400 hover:text-green-500" title="查看"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
            {/* 分页 */}
            <div className="flex justify-center mt-4 gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>上一页</Button>
              <span className="px-2 text-gray-500">第 {page} 页</span>
              <Button size="sm" variant="outline" disabled={stories.length < pageSize} onClick={() => handlePageChange(page + 1)}>下一页</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-10" />
      <CreateWorkModal open={modalOpen} onOpenChange={setModalOpen} />
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>确定要删除该故事吗？删除后无法恢复。</DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button className="bg-red-500 text-white" onClick={handleDeleteStory}>确认</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}