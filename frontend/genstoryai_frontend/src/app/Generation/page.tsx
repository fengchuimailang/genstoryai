import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Check, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

function PageHeader() {
    return (
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
        <div className="font-bold text-lg text-[#222] leading-tight">霸道总裁爱上我</div>
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
    );
  }

const initialRole = {
  id: '', // 新增唯一id
  name: "1",
  gender: "1",
  tag: "1",
  age: "1",
  character: "1",
  background: "1",
  nickname: "1",
  identity: "1",
  job: "1",
  detail: "1",
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

function LabeledInput({ label, value, onChange, required, readOnly }: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 w-8 text-right">{label}</span>
      {readOnly ? (
        <span className="flex items-center flex-1 text-xs text-gray-800 min-h-[2rem]">{value}</span>
      ) : (
        <Input
          value={value}
          onChange={onChange}
          className={`h-8 text-xs bg-[#f5f5f5] rounded-md flex-1 ${required && !value ? "border border-red-400" : ""}`}
        />
      )}
    </div>
  );
}

function RoleCardOptimized({ role, onChange, onSave, onDelete, isEditingDefault = false, isNew = false, onDeleteConfirm, forceCollapsed, onForceExpand }: {
  role: RoleType;
  onChange: (key: keyof RoleType, value: string) => void;
  onSave: (role: RoleType) => Promise<void>;
  onDelete?: () => void;
  isEditingDefault?: boolean;
  isNew?: boolean;
  onDeleteConfirm?: () => void;
  forceCollapsed?: boolean;
  onForceExpand?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(isEditingDefault);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAICard, setShowAICard] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // 默认折叠
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

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
  const confirmDelete = () => {
    setShowDeleteModal(false);
    onDeleteConfirm && onDeleteConfirm();
  };

  const validate = () => Object.values(role).every(val => !!val);

  const handleSave = async () => {
    if (!validate()) {
      setError("请填写所有字段");
      return;
    }
    setError("");
    setLoading(true);
    await onSave(role);
    setLoading(false);
    setIsEditing(false);
    setShowAICard(false);
  };

  return (
    <div className="bg-[#f6f8fa] rounded-2xl p-4 px-6 shadow-sm relative transition-all duration-300" style={{ minHeight: collapsed ? 56 : undefined }}>
      <div className="flex items-center">
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src="/avatars/user.jpg" />
        </Avatar>
        <span className="font-bold text-base cursor-pointer select-none" onClick={() => setCollapsed(v => !v)}>{role.name || "未命名"}</span>
        <div className="ml-auto flex gap-2 items-center">
          {/* AI生成按钮仅编辑时显示 */}
          {isEditing && (
            <Button
              className="bg-[#22b07d] text-white rounded-md flex items-center justify-center px-2 py-1"
              style={{ minWidth: 0 }}
              onClick={() => setShowAICard(v => !v)}
              type="button"
            >
              AI生成
            </Button>
          )}
          {!isEditing ? (
            <Edit className="w-4 h-4 cursor-pointer text-gray-400 hover:text-[#22b07d]" onClick={handleEdit} />
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
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600" onClick={handleDelete} />
          {collapsed ? (
            <ChevronUp className="w-4 h-4 cursor-pointer text-gray-400 hover:text-[#22b07d]" onClick={() => setCollapsed(false)} />
          ) : (
            <ChevronDown className="w-4 h-4 cursor-pointer text-gray-400 hover:text-[#22b07d]" onClick={() => setCollapsed(true)} />
          )}
        </div>
      </div>
      {/* AI生成弹出卡片内容 */}
      {showAICard && isEditing && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 top-12 bg-white rounded-xl shadow-lg p-6 flex flex-col min-w-[340px] border border-gray-100" style={{width: 360}}>
          {/* 标签区 */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-base text-[#222]">标签</span>
            <button className="text-gray-400 text-sm hover:text-[#22b07d]">清空</button>
          </div>
          {/* 标签列表 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['都市脑洞','乡村','校园','末世','民国','末世','民国','未来','末世','校园','末世','民国'].map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-lg text-xs mb-1 cursor-pointer ${tag === '校园' ? 'bg-[#C6F4E5] text-[#22b07d]' : 'bg-[#F3F4F6] text-gray-500'}`}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* 提示词区 */}
          <div className="font-semibold text-base text-[#222] mb-2">✦ 提示词</div>
          <div className="relative">
            <input
              className="w-full h-12 rounded-xl bg-[#F5F5F5] px-4 pr-12 text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none"
              placeholder="认真填写提示词会使生成的角色效果更好哦~"
              disabled
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#22b07d] flex items-center justify-center"
              type="button"
              tabIndex={-1}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10h10M10 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
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
        {error && <div className="text-xs text-red-500 mb-1">{error}</div>}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {(["name", "gender", "tag", "age"] as (keyof typeof labelMap)[]).map((key) => (
            <LabeledInput
              key={key}
              label={labelMap[key]}
              value={role[key]}
              onChange={e => onChange(key, e.target.value)}
              required
              readOnly={!isEditing}
            />
          ))}
          <div className="col-span-2">
            <LabeledInput
              label={labelMap.character}
              value={role.character}
              onChange={e => onChange("character", e.target.value)}
              required
              readOnly={!isEditing}
            />
          </div>
          <div className="col-span-2">
            <LabeledInput
              label={labelMap.background}
              value={role.background}
              onChange={e => onChange("background", e.target.value)}
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
              onChange={e => onChange(key, e.target.value)}
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
              <Button className="bg-red-500 text-white" onClick={confirmDelete}>确认</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GenerationPage() {
  const genId = () => Date.now().toString() + Math.random().toString(36).slice(2, 8);
  const [mainRoles, setMainRoles] = useState([
    { ...initialRole, id: genId() },
    { ...initialRole, id: genId() },
    { ...initialRole, id: genId() },
  ]);
  const [subRoles, setSubRoles] = useState([
    { ...initialRole, id: genId() },
    { ...initialRole, id: genId() },
    { ...initialRole, id: genId() },
  ]);
  const [mainEditingIdx, setMainEditingIdx] = useState<number | null>(null);
  const [subEditingIdx, setSubEditingIdx] = useState<number | null>(null);
  const [mainAllCollapsed, setMainAllCollapsed] = useState<boolean | null>(true); // true:全部折叠，false:全部展开，null:不批量控制
  const [subAllCollapsed, setSubAllCollapsed] = useState<boolean | null>(true);
  const [mainExpandIdx, setMainExpandIdx] = useState<number | null>(null);
  const [subExpandIdx, setSubExpandIdx] = useState<number | null>(null);

  // 标记新建卡片
  const mainIsNew = mainRoles.map((_, idx) => idx >= 3); // 前3个为后台，后面为新建
  const subIsNew = subRoles.map((_, idx) => idx >= 3);

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

  // 删除后台数据
  const deleteRole = (type: "main" | "sub", idx: number) => {
    const setter = type === "main" ? setMainRoles : setSubRoles;
    const roles = type === "main" ? [...mainRoles] : [...subRoles];
    roles.splice(idx, 1);
    setter(roles);
  };

  // 添加新卡片并自动进入编辑状态，插入到第一个
  const addRole = (type: "main" | "sub") => {
    const setter = type === "main" ? setMainRoles : setSubRoles;
    const roles = type === "main" ? [...mainRoles] : [...subRoles];
    roles.splice(0, 0, { ...initialRole, id: genId() });
    setter(roles);
    if (type === "main") {
      setMainEditingIdx(0);
      setMainExpandIdx(0); // 只展开新卡片
    } else {
      setSubEditingIdx(0);
      setSubExpandIdx(0); // 只展开新卡片
    }
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
        < PageHeader />
      <div className="flex flex-1">
        <div className="w-[400px] bg-white p-4 shadow-xl bg-[#f9fafb] rounded-2xl "
        style={{
          maxHeight: 'calc(100vh - 48px)', // 48px 可根据你的顶部header高度调整
          overflowY: 'auto'
        }}
        >
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
                  onChange={(key, value) => updateRole("main", idx, key, value)}
                  onSave={saveRole}
                  isEditingDefault={mainEditingIdx === idx}
                  isNew={mainIsNew[idx]}
                  onDelete={() => deleteRole("main", idx)}
                  onDeleteConfirm={() => deleteRole("main", idx)}
                  forceCollapsed={mainAllCollapsed !== null ? mainAllCollapsed : (mainExpandIdx === idx ? false : undefined)}
                  onForceExpand={() => handleForceExpand("main", idx)}
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
                  onChange={(key, value) => updateRole("sub", idx, key, value)}
                  onSave={saveRole}
                  isEditingDefault={subEditingIdx === idx}
                  isNew={subIsNew[idx]}
                  onDelete={() => deleteRole("sub", idx)}
                  onDeleteConfirm={() => deleteRole("sub", idx)}
                  forceCollapsed={subAllCollapsed !== null ? subAllCollapsed : (subExpandIdx === idx ? false : undefined)}
                  onForceExpand={() => handleForceExpand("sub", idx)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
}