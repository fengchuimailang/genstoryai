import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Check, Eye, ChevronDown, ChevronUp, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useStoryStore } from '@/lib/store';
import axios from 'axios';
import { GENDER_MAP } from '@/types';
import type { Gender } from '@/types';
const initialRole = {
  id: '',
  name: '',
  is_main: false,
  gender: '',
  age: '',
  mbti: '',
  personality: '',
  backstory: '',
  appearance: '',
  character_arc: '',
  personality_quirks: '',
  description: '',
  tag: '',
  character: '',
  background: '',
  nickname: '',
  identity: '',
  job: '',
  detail: '',
};

const labelMap = {
  name: "姓名",
  gender: "性别",
  tag: "标签",
  age: "年龄",
  character: "性格",
  background: "背景",
  nickname: "绰号",
  identity: "身份",
  job: "职业",
  detail: "细节",
};

type RoleType = typeof initialRole;

function LabeledInput({ label, value, onChange, required, readOnly, fieldKey }: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  fieldKey?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 w-8 text-right">{label}</span>
      {fieldKey === 'gender' ? (
        readOnly ? (
          <span className="flex items-center flex-1 text-xs text-gray-800 min-h-[2rem]">{GENDER_MAP[value as keyof typeof GENDER_MAP] || value}</span>
        ) : (
          <select
            value={value}
            onChange={onChange}
            className={`h-8 text-xs bg-[#f5f5f5] rounded-md flex-1 ${required && !value ? "border border-red-400" : ""}`}
            disabled={readOnly}
          >
            {Object.entries(GENDER_MAP).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        )
      ) : readOnly ? (
        <span className="flex items-center flex-1 text-xs text-gray-800 min-h-[2rem]">{value}</span>
      ) : (
        <Input
          value={value}
          onChange={onChange as any}
          className={`h-8 text-xs bg-[#f5f5f5] rounded-md flex-1 ${required && !value ? "border border-red-400" : ""}`}
        />
      )}
    </div>
  );
}

function RoleCardOptimized({ role, onChange, onSave, onDelete, isEditingDefault = false, isNew = false, onDeleteConfirm, forceCollapsed, onForceExpand, onCollapse }: {
  role: RoleType;
  onChange: (key: keyof RoleType, value: string) => void;
  onSave: (role: RoleType) => Promise<void>;
  onDelete?: () => void;
  isEditingDefault?: boolean;
  isNew?: boolean;
  onDeleteConfirm?: () => void;
  forceCollapsed?: boolean;
  onForceExpand?: () => void;
  onCollapse?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAICard, setShowAICard] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { currentStory } = useStoryStore();
  const [collapsed, setCollapsed] = useState(true); // 默认折叠
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [form, setForm] = useState(role); // 编辑时的表单数据
  useEffect(() => { setForm(role); }, [role]); // role变化时同步

  // 受控折叠
  useEffect(() => {
    if (typeof forceCollapsed === 'boolean') {
      setCollapsed(forceCollapsed);
    }
  }, [forceCollapsed]);

  useEffect(() => {
    if (contentRef.current && !collapsed) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [collapsed, isEditing, role]);

  // 编辑时自动展开
  const handleEdit = () => {
    if (collapsed) {
      setCollapsed(false);
      setTimeout(() => setIsEditing(true), 200); // 动画后再进入编辑
    } else {
      setIsEditing(true);
    }
  };

  // 删除按钮点击
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNew) {
      onDelete && onDelete();
    } else {
      setShowDeleteModal(true);
    }
  };

  // 确认删除
  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/character/${role.id}`, { data: { character_id: role.id } });
      setShowDeleteModal(false);
      onDeleteConfirm && onDeleteConfirm(); // 父组件移除卡片
    } catch (e) {
      setError('删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 校验必填项
  const validate = () => {
    if (!form.name || !form.gender || !form.age) {
      setError('请填写姓名、性别、年龄');
      return false;
    }
    return true;
  };
  // 判断是否有修改
  const isModified = () => {
    return Object.keys(form).some(key => form[key as keyof RoleType] !== role[key as keyof RoleType]);
  };
  // 保存
  const handleSave = async () => {
    setError('');
    if (!validate()) return;
    if (!isModified()) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await axios.put(`/api/character/${role.id}`, {
        name: form.name,
        is_main: form.is_main,
        gender: form.gender,
        age: Number(form.age),
        mbti: form.mbti,
        personality: form.personality,
        backstory: form.backstory,
        appearance: form.appearance,
        character_arc: form.character_arc,
        personality_quirks: form.personality_quirks,
        description: form.description,
      });
      setIsEditing(false);
      // 可选：刷新角色数据
    } catch (e) {
      setError('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // AI生成按钮点击
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError("请输入内容");
      return;
    }
    setError("");
    setAILoading(true);
    try {
      const res = await axios.post('/api/character/generate/', {
        user_prompt: aiPrompt,
        // story_id: currentStory?.id,
        story_id: 1,
      });
      // 假设返回角色对象，直接同步到当前卡片
      const data = res.data;
      if (data) {
        Object.keys(data).forEach(key => {
          if (key in role) onChange(key as keyof RoleType, data[key]);
        });
      }
      setShowAICard(false);
      setAIPrompt("");
    } catch (e) {
      setError("生成失败，请重试");
    } finally {
      setAILoading(false);
    }
  };

  // 语音输入逻辑
  const handleVoiceInput = () => {
    if (!(window as any).webkitSpeechRecognition) {
      setError("当前浏览器不支持语音输入");
      return;
    }
    if (recognizing) {
      recognitionRef.current?.stop();
      setRecognizing(false);
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = true; // 持续识别
    recognition.interimResults = true; // 实时
    recognition.onstart = () => setRecognizing(true);
    recognition.onerror = (e: any) => {
      setError("语音识别失败，请重试");
      setRecognizing(false);
    };
    recognition.onend = () => {
      setRecognizing(false);
    };
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setAIPrompt(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // 关闭AI弹窗时清空输入框内容
  const handleCloseAICard = () => {
    setShowAICard(false);
    setAIPrompt("");
  };

  return (
    <div className="bg-[#f6f8fa] rounded-2xl p-4 px-6 shadow-sm ">
      <div className="flex items-center mb-3">
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src="/avatars/user.jpg" />
        </Avatar>
        <span className="font-bold text-base">{role.name || "未命名"}</span>
        <div className="ml-auto flex gap-2 items-center">
          {/* AI生成按钮仅编辑时显示 */}
          {isEditing && (
            <Button
              className="bg-[#22b07d] text-white rounded-md flex items-center justify-center px-2 py-1"
              style={{ minWidth: 0 }}
              onClick={() => {
                if (showAICard) {
                  handleCloseAICard();
                } else {
                  setShowAICard(true);
                }
              }}
              type="button"
            >
              AI生成
            </Button>
          )}
          {!isEditing ? (
            <Edit className="w-4 h-4 cursor-pointer text-gray-400 hover:text-[#22b07d]" onClick={() => setIsEditing(true)} />
          ) : (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0CB994] ml-1 cursor-pointer"
              onClick={handleSave}
            >
              {loading ? (
                <svg className="animate-spin w-3 h-3 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /></svg>
              ) : (
                <Check className="w-3 h-3 text-white" />
              )}
            </span>
          )}
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600" onClick={onDelete} />
        </div>
      </div>
      {/* AI生成弹出卡片内容 */}
      {showAICard && isEditing && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 top-12 bg-white rounded-xl shadow-lg p-6 flex flex-col min-w-[340px] border border-gray-100" style={{width: 360}}>
          {/* 只保留提示词区 */}
          <div className="font-semibold text-base text-[#222] mb-2">✦ 提示词</div>
          <div className="flex items-center mb-2">
            <textarea
              className="flex-1 w-full h-20 rounded-xl bg-[#F5F5F5] px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none resize-none"
              placeholder="认真填写提示词会使生成的角色效果更好哦~"
              value={aiPrompt}
              onChange={e => setAIPrompt(e.target.value)}
              disabled={aiLoading}
            />
            <button
              type="button"
              className={`ml-2 p-2 rounded-full ${recognizing ? 'bg-green-200' : 'bg-gray-100'} hover:bg-green-100`}
              onClick={handleVoiceInput}
              disabled={aiLoading}
              title="语音输入"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
          <button
            className="w-full h-10 rounded-xl bg-[#22b07d] text-white flex items-center justify-center font-bold text-base"
            type="button"
            onClick={handleAIGenerate}
            disabled={aiLoading}
          >
            {aiLoading ? '生成中...' : '生成'}
          </button>
          {/* 关闭弹窗按钮，可根据你的UI风格放置 */}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleCloseAICard}
            type="button"
            style={{fontSize: 20, background: 'none', border: 'none'}}
            aria-label="关闭"
          >×</button>
        </div>
      )}
      {/* 折叠内容动画区 */}
      <div
        ref={contentRef}
        style={{
          maxHeight: collapsed ? 0 : contentHeight,
          opacity: collapsed ? 0 : 1,
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s',
        }}
      >
        <div className="grid grid-cols-2 gap-2 mb-2">
          {(["name", "gender", "tag", "age"] as (keyof typeof labelMap)[]).map((key) => (
            <LabeledInput
              key={key}
              label={labelMap[key]}
              value={role[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              required
              readOnly={!isEditing}
              fieldKey={key}
            />
          ))}
          <div className="col-span-2">
            <LabeledInput
              label={labelMap.character}
              value={role.character}
              onChange={e => setForm({ ...form, character: e.target.value })}
              required
              readOnly={!isEditing}
            />
          </div>
          <div className="col-span-2">
            <LabeledInput
              label={labelMap.background}
              value={role.background}
              onChange={e => setForm({ ...form, background: e.target.value })}
              required
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="border-t border-[#e5e7eb] my-2" />
        <div className="grid grid-cols-2 gap-2">
          {(["nickname", "identity", "job", "detail"] as (keyof typeof labelMap)[]).map((key) => (
            <LabeledInput
              key={key}
              label={labelMap[key]}
              value={role[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              required
              readOnly={!isEditing}
            />
          ))}
        </div>
      </div>
      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 min-w-[260px] shadow-lg">
            <div className="text-base font-semibold mb-4">确认删除该角色？</div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>取消</Button>
              <Button className="bg-red-500 text-white" onClick={confirmDelete} disabled={loading}>{loading ? '删除中...' : '确认'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GenerationPage() {
  const { currentStory } = useStoryStore();
  const genId = () => Date.now().toString() + Math.random().toString(36).slice(2, 8);
  const [mainRoles, setMainRoles] = useState<any[]>([]);
  const [subRoles, setSubRoles] = useState<any[]>([]);
  const [mainEditingIdx, setMainEditingIdx] = useState<number | null>(null);
  const [subEditingIdx, setSubEditingIdx] = useState<number | null>(null);
  const [mainAllCollapsed, setMainAllCollapsed] = useState<boolean | null>(true); // true:全部折叠，false:全部展开，null:不批量控制
  const [subAllCollapsed, setSubAllCollapsed] = useState<boolean | null>(true);
  const [mainExpandIdx, setMainExpandIdx] = useState<number | null>(null);
  const [subExpandIdx, setSubExpandIdx] = useState<number | null>(null);

  useEffect(() => {
    // 请求人物信息
    axios.get('/api/character/', { params: { skip: 0, limit: 9999 } })
      .then(res => {
        const data = res.data || [];
        setMainRoles(data.filter((item: any) => item.is_main));
        setSubRoles(data.filter((item: any) => !item.is_main));
      });
  }, []);

  // 添加新卡片并自动进入编辑状态，插入到第一个
  const addRole = (type: "main" | "sub") => {
    if (type === "main") {
      if (mainRoles[0]?.isNew && mainEditingIdx === 0) return;
      const roles = [...mainRoles];
      roles.splice(0, 0, { ...initialRole, id: '', isNew: true });
      setMainRoles(roles);
      setMainEditingIdx(0);
      setMainExpandIdx(0);
      setMainAllCollapsed(null); // 允许单卡片展开
    } else {
      if (subRoles[0]?.isNew && subEditingIdx === 0) return;
      const roles = [...subRoles];
      roles.splice(0, 0, { ...initialRole, id: '', isNew: true });
      setSubRoles(roles);
      setSubEditingIdx(0);
      setSubExpandIdx(0);
      setSubAllCollapsed(null); // 允许单卡片展开
    }
  };

  // 删除角色
  const deleteRole = (type: "main" | "sub", idx: number) => {
    const setter = type === "main" ? setMainRoles : setSubRoles;
    const roles = type === "main" ? [...mainRoles] : [...subRoles];
    roles.splice(idx, 1);
    setter(roles);
  };

  // 标记新建卡片
  const mainIsNew = mainRoles.map(role => role.isNew || !role.id);
  const subIsNew = subRoles.map(role => role.isNew || !role.id);

  const updateRole = (type: "main" | "sub", idx: number, key: keyof RoleType, value: string) => {
    const setter = type === "main" ? setMainRoles : setSubRoles;
    const roles = type === "main" ? [...mainRoles] : [...subRoles];
    roles[idx][key] = value;
    setter(roles);
  };

  // 模拟接口调用
  const saveRole = async (role: RoleType) => {
    return new Promise<void>(resolve => setTimeout(resolve, 800));
  };

  const handleForceExpand = (type: "main" | "sub", idx: number) => {
    if (type === "main") {
      setMainAllCollapsed(false);
      setMainEditingIdx(idx);
    } else {
      setSubAllCollapsed(false);
      setSubEditingIdx(idx);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
        <div className="w-full h-14 flex items-center justify-between bg-white border-b px-6 shadow-sm">
          {/* 左侧Logo和系统名 */}
          <div className="flex items-center">
            {/* 房子图标 */}
            <div className="w-12 h-12 flex items-center justify-center mr-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="2" y="2" width="32" height="32" rx="8" stroke="#00AD88" strokeWidth="2" fill="white"/>
                <path d="M12 22V16.5L18 12L24 16.5V22C24 22.5523 23.5523 23 23 23H13C12.4477 23 12 22.5523 12 22Z" stroke="#00AD88" strokeWidth="2" strokeLinejoin="round"/>
                <rect x="15" y="19" width="6" height="4" rx="1" stroke="#00AD88" strokeWidth="2"/>
              </svg>
            </div>
            {/* 系统名称和标签 */}
            <div>
              <div className="font-bold text-lg text-[#222] leading-tight">{currentStory?.title || '未命名故事'}</div>
              <div className="flex items-center mt-1 gap-2">
                <span className="bg-[#F3F4F6] text-gray-500 text-xs rounded-lg px-3 py-1">第一人称</span>
                <span className="bg-[#F3F4F6] text-gray-500 text-xs rounded-lg px-3 py-1">女频</span>
                <span className="text-gray-400 text-xs ml-2">字数统计:0</span>
              </div>
            </div>
          </div>
          {/* 右侧通知和头像 */}
          <div className="flex items-center gap-4">
            <button className="relative">
              <span className="sr-only">通知</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <img src="/avatars/user.jpg" alt="" className="w-8 h-8 rounded-full" />
          </div>
        </div>
      <div className="flex flex-1">
        <div className="w-[400px] bg-white p-4 shadow-xl bg-[#f9fafb] rounded-2xl flex flex-col relative"
        style={{
          maxHeight: 'calc(100vh - 60px)',
        }}
        >
          <div className="flex-1 overflow-y-auto">
            {/* 主要角色 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-base mr-4 cursor-pointer select-none" onClick={() => {
                  setMainAllCollapsed(v => v === true ? false : true);
                  setMainExpandIdx(null);
                }}>主要角色</span>
                <Button size="sm" variant="outline" className="ml-2 h-8 px-3" onClick={() => addRole("main")}>+ 添加</Button>
              </div>
              {/* 改为每行一个卡片 */}
              <div className="grid grid-cols-1 gap-5 mb-10">
                {mainRoles.map((role, idx) => (
                  <RoleCardOptimized
                    key={role.id || idx}
                    role={role}
                    onChange={() => {}}
                    onSave={async () => {}}
                    isEditingDefault={mainEditingIdx === idx}
                    isNew={mainIsNew[idx]}
                    onDelete={() => {
                      if (mainIsNew[idx]) {
                        deleteRole("main", idx);
                      } else {
                        setMainEditingIdx(null);
                        setMainExpandIdx(null);
                      }
                    }}
                    onDeleteConfirm={() => deleteRole("main", idx)}
                    forceCollapsed={mainAllCollapsed !== null ? mainAllCollapsed : (mainExpandIdx === idx ? false : undefined)}
                    onForceExpand={() => {}}
                    // 新增：折叠时的回调
                    onCollapse={() => {
                      if (mainEditingIdx === idx) {
                        setMainEditingIdx(null);
                        setMainExpandIdx(null);
                      } else {
                        setMainExpandIdx(null);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            {/* 分隔线 */}
            <div className="border-t border-[#e5e7eb] my-6" />
            {/* 次要角色 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-base mr-4 cursor-pointer select-none" onClick={() => {
                  setSubAllCollapsed(v => v === true ? false : true);
                  setSubExpandIdx(null);
                }}>次要角色</span>
                <Button size="sm" variant="outline" className="ml-2 h-8 px-3" onClick={() => addRole("sub")}>+ 添加</Button>
              </div>
              {/* 改为每行一个卡片 */}
              <div className="grid grid-cols-1 gap-5">
                {subRoles.map((role, idx) => (
                  <RoleCardOptimized
                    key={role.id || idx}
                    role={role}
                    onChange={() => {}}
                    onSave={async () => {}}
                    isEditingDefault={subEditingIdx === idx}
                    isNew={subIsNew[idx]}
                    onDelete={() => {
                      if (subIsNew[idx]) {
                        deleteRole("sub", idx);
                      } else {
                        setSubEditingIdx(null);
                        setSubExpandIdx(null);
                      }
                    }}
                    onDeleteConfirm={() => deleteRole("sub", idx)}
                    forceCollapsed={subAllCollapsed !== null ? subAllCollapsed : (subExpandIdx === idx ? false : undefined)}
                    onForceExpand={() => {}}
                    // 新增：折叠时的回调
                    onCollapse={() => {
                      if (subEditingIdx === idx) {
                        setSubEditingIdx(null);
                        setSubExpandIdx(null);
                      } else {
                        setSubExpandIdx(null);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* 固定底部按钮 */}
          <button
            className="mt-4 px-8 py-2 rounded-full text-white font-bold text-base"
            style={{
              background: 'linear-gradient(90deg, #2E6CF6 0%, #8F6AF6 100%)',
              zIndex: 10,
            }}
          >
            ✨ 生成故事章节
          </button>
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
}
