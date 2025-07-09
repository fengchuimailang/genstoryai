import { Dialog, DialogContent, DialogTitle ,DialogDescription} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./CreateWorkModal.css";

interface CreateWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ["都市脑洞", "乡村", "校园", "末世", "民国", "未来"];
const tags = ["都市脑洞", "乡村", "校园", "末世", "民国", "未来"];

export default function CreateWorkModal({ open, onOpenChange }: CreateWorkModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [catalog, setCatalog] = useState("no");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // 下一步按钮点击事件
  const handleNext = () => {
    if (!name.trim()) {
      setError("请填写作品名称");
      return;
    }
    if (category.length === 0) {
      setError("请选择作品分类");
      return;
    }
    if (tag.length === 0) {
      setError("请选择作品标签");
      return;
    }
    if (!catalog) {
      setError("请选择目录选项");
      return;
    }
    if (!desc.trim()) {
      setError("请填写作品简介");
      return;
    }
    setError(""); // 清空错误
    // 通过校验，执行后续逻辑
    navigate("/generation");
    console.log("校验通过，提交数据");
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
              <Input className="flex-1 h-10 text-base" placeholder="请输入作品名称" value={name} onChange={e => setName(e.target.value)} />
            </div>
            {/* 作品分类 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">作品分类</div>
              <div className="flex flex-wrap gap-2 flex-1">
                {categories.map(c => (
                  <Button
                    key={c}
                    variant="outline"
                    size="sm"
                    className={`h-10 px-4 rounded-lg border-none text-base ${category.includes(c) ? "!bg-[#EFFDFA] !text-[#00AD88]" : "!bg-[#F5F5F5] !text-[#666]"}`}
                    onClick={() => setCategory(category.includes(c) ? category.filter(i => i !== c) : [...category, c])}
                  >
                    {c}
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
                    className={`h-10 px-4 rounded-lg border-none text-base ${tag.includes(t) ? "!bg-[#EFFDFA] !text-[#00AD88]" : "!bg-[#F5F5F5] !text-[#666]"}`}
                    onClick={() => setTag(tag.includes(t) ? tag.filter(i => i !== t) : [...tag, t])}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            {/* 选择目录 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">选择目录</div>
              <div className="flex gap-6 flex-1">
                <label className="flex items-center gap-1 cursor-pointer text-base font-normal h-10">
                  <input type="radio" checked={catalog === "no"} onChange={() => setCatalog("no")} className="accent-[#00AD88] w-4 h-4"/>
                  不需要目录
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-base font-normal h-10">
                  <input type="radio" checked={catalog === "need"} onChange={() => setCatalog("need")} className="accent-[#00AD88] w-4 h-4"/>
                  需要章
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-base font-normal h-10">
                  <input type="radio" checked={catalog === "need_section"} onChange={() => setCatalog("need_section")} className="accent-[#00AD88] w-4 h-4"/>
                  需要章和节
                </label>
              </div>
            </div>
            {/* 作品简介 */}
            <div className="flex items-center">
              <div className="w-24 text-base font-bold text-left text-[#222]">作品简介</div>
              <textarea className="flex-1 h-20 border rounded-lg p-2 text-base resize-none bg-[#F5F5F5]" placeholder="认真填写更有机会生成的效果更好哦~" value={desc} onChange={e => setDesc(e.target.value)} />
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
