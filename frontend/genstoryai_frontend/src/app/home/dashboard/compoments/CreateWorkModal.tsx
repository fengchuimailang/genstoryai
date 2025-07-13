import { Dialog, DialogContent, DialogTitle ,DialogDescription} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryGenre, Language } from '@/types';
import { createStory } from '@/api/story-api';
import { useStoryStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';
// import "./CreateWorkModal.css";

interface CreateWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ["都市脑洞", "乡村", "校园", "末世", "民国", "未来"];
const tags = ["都市脑洞", "乡村", "校园", "末世", "民国", "未来"];

export default function CreateWorkModal({ open, onOpenChange }: CreateWorkModalProps) {
  // 在组件内补全所有表单字段state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('zh');
  const [genre, setGenre] = useState('fantasy');
  const [summary, setSummary] = useState('');
  const [outline, setOutline] = useState('');
  const [version_time, setVersionTime] = useState('');
  const [version_text, setVersionText] = useState('');
  const [story_template_id, setStoryTemplateId] = useState(0);
  const [ssf, setSsf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = useAuthStore(state => state.user?.id || 0);
  const navigate = useNavigate();
  const setCurrentStory = useStoryStore(state => state.setCurrentStory);

  // 下一步按钮点击事件
  const handleNext = async () => {
    // 简单校验
    if (!title || !genre || !language) {
      setError('请填写必填项');
      return;
    }
    setLoading(true);
    try {
      const storyData = {
        title,
        creator_user_id: userId, // 需从登录用户获取
        author,
        language,
        genre,
        summary,
        outline,
        version_time,
        version_text,
        story_template_id,
        ssf,
      };
      const result = await createStory(storyData);
      setCurrentStory(result);
      navigate('/story/' + result.id);
    } catch (e) {
      setError('创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[700px] rounded-3xl p-0 bg-transparent border-none shadow-none flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-xl px-10 py-8 w-full mx-auto">
          <DialogTitle className="text-center text-lg font-bold mb-6 text-[#222]">✨ 作品基本信息</DialogTitle>
          <DialogDescription className="text-center mb-4 text-gray-500 text-sm">
    请完善作品信息以获得更好的创作体验
  </DialogDescription>
          {error && (
            <div className="text-red-500 text-center mb-2 text-sm">{error}</div>
          )}
          <div className="space-y-4">
            {/* 作品名称 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">作品名称</div>
              <Input className="flex-1 h-10 text-base" placeholder="请输入作品名称" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            {/* 作品分类 */}
            <div className="flex items-start">
              <div className="w-24 text-base font-bold text-left text-[#222]">作品分类</div>
              <div className="flex flex-wrap gap-2 flex-1">
                {Object.entries(StoryGenre).map(([key, label])=> (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className={`h-10 px-4 rounded-lg border-none text-base ${genre === key ? "!bg-[#EFFDFA] !text-[#00AD88]" : "!bg-[#F5F5F5] !text-[#666]"}`}
                    onClick={() => setGenre(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            {/* 作品标签 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">作品标签</div>
              <div className="flex flex-wrap gap-2 flex-1">
                {tags.map(t => (
                  <Button
                    key={t}
                    variant="outline"
                    size="sm"
                    className={`h-10 px-4 rounded-lg border-none text-base ${genre.includes(t) ? "!bg-[#EFFDFA] !text-[#00AD88]" : "!bg-[#F5F5F5] !text-[#666]"}`}
                    onClick={() => setGenre(genre.includes(t) ? genre.filter(i => i !== t) : [...genre, t])}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            {/* 选择目录 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">选择语言</div>
              <div className="flex gap-6 flex-1">
                {Object.entries(Language).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1 cursor-pointer text-base font-normal h-10">
                    <input type="radio" checked={language === key} onChange={() => setLanguage(key)} className="accent-[#00AD88] w-4 h-4" />
                    {label as string}
                  </label>
                ))}
              </div>
            </div>
            {/* 作品简介 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">作品简介</div>
              <textarea className="flex-1 h-20 border rounded-lg p-2 text-base resize-none bg-[#F5F5F5]" placeholder="认真填写更有机会生成的效果更好哦~" value={summary} onChange={e => setSummary(e.target.value)} />
            </div>
            {/* 下一步按钮 */}
            <div className="flex justify-center mt-4">
              <Button className="w-48 h-12 text-lg font-bold bg-[#22b07d] hover:bg-[#1a8c63] text-white rounded-full" onClick={handleNext}>+ 下一步</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
