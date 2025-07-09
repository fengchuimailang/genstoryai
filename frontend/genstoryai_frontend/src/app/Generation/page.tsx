import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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

function RoleCardOptimized({ role, onChange, onSave, onDelete }: {
  role: RoleType;
  onChange: (key: keyof RoleType, value: string) => void;
  onSave: (role: RoleType) => Promise<void>;
  onDelete?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  };

  return (
    <div className="bg-[#f6f8fa] rounded-2xl p-4 px-6 shadow-sm ">
      <div className="flex items-center mb-3">
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src="/avatars/user.jpg" />
        </Avatar>
        <span className="font-bold text-base">{role.name || "未命名"}</span>
        <div className="ml-auto flex gap-2 items-center">
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
      {error && <div className="text-xs text-red-500 mb-1">{error}</div>}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {(["name", "gender", "tag", "age"] as (keyof RoleType)[]).map(key => (
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
        {(["nickname", "identity", "job", "detail"] as (keyof RoleType)[]).map(key => (
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
  );
}

export default function GenerationPage() {
  const [mainRoles, setMainRoles] = useState([ { ...initialRole }, { ...initialRole } ,{ ...initialRole }]);
  const [subRoles, setSubRoles] = useState([ { ...initialRole }, { ...initialRole } ,{ ...initialRole }]);

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
        < PageHeader />
      <div className="flex flex-1">
        <div className="w-[560px] bg-white p-6">
          {/* 主要角色 */}
          <div>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-base mr-4">主要角色</span>
              <Button size="sm" className="ml-auto bg-[#22b07d] text-white rounded-full h-8 px-3">+ AI 生成</Button>
              <Button size="sm" variant="outline" className="ml-2 h-8 px-3">+ 添加</Button>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-10">
              {mainRoles.map((role, idx) => (
                <RoleCardOptimized
                  key={idx}
                  role={role}
                  onChange={(key, value) => updateRole("main", idx, key, value)}
                  onSave={saveRole}
                />
              ))}
            </div>
          </div>
          {/* 分隔线 */}
          <div className="border-t border-[#e5e7eb] my-6" />
          {/* 次要角色 */}
          <div>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-base mr-4">次要角色</span>
              <Button size="sm" className="ml-auto bg-[#22b07d] text-white rounded-full h-8 px-3">+ AI 生成</Button>
              <Button size="sm" variant="outline" className="ml-2 h-8 px-3">+ 添加</Button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {subRoles.map((role, idx) => (
                <RoleCardOptimized
                  key={idx}
                  role={role}
                  onChange={(key, value) => updateRole("sub", idx, key, value)}
                  onSave={saveRole}
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