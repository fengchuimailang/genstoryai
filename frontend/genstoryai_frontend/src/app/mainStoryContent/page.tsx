'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pen,
  Plus,
  Edit,
  Trash2,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  Bell,
  User,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Outdent,
  Indent,
  MessageSquare
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './gradient-typing.css';

interface Chapter {
  id: number;
  title: string;
  description: string;
  content: string;
}

const defaultChapters: Chapter[] = [
  {
    id: 1,
    title: "第一章 你好",
    description: "苏晚醒来后失去全部记忆,只对红玫瑰表现出病态恐惧。我让周秘书,",
    content: "苏晚醒来后发现自己躺在一间陌生的房间里，四周的墙壁都是纯白色的，没有任何装饰。她的头很痛，仿佛被重物击中过一样。她试图回忆自己是谁，但脑海中一片空白，连自己的名字都想不起来。\n\n她环顾四周，发现床头柜上放着一朵红玫瑰，花瓣鲜艳如血。不知道为什么，看到这朵玫瑰，她的心中涌起一阵强烈的恐惧，心跳加速，呼吸变得急促。她想要逃离，但身体却动弹不得。\n\n就在这时，门被推开了，一个穿着白大褂的男人走了进来。他的脸上带着温和的笑容，但苏晚却感到一阵寒意。'你醒了？男人问道，声音听起来很熟悉，但她却想不起在哪里听过。\n\n我是谁？'苏晚问道，声音有些颤抖。\n\n男人走到床边，拿起那朵红玫瑰，在手中把玩着。你叫苏晚，是我的病人。他说道，你因为一场意外失去了记忆，我们正在帮你恢复。undefinedn\n苏晚看着那朵红玫瑰，心中的恐惧越来越强烈。她想要尖叫，但声音却卡在喉咙里。她不知道这种恐惧从何而来，但它确实存在，而且越来越强烈。\n\n'我...我害怕玫瑰。苏晚终于说出了心中的恐惧。\n\n男人愣了一下，然后笑了。这很正常，'他说道，'在治疗过程中，你可能会对一些事物产生恐惧反应。这是大脑在保护你。'\n\n但苏晚知道，这种恐惧不仅仅是治疗反应。她感觉这朵红玫瑰背后隐藏着什么可怕的东西，某种她不愿意想起的记忆。\n\n周秘书，男人对着门外喊道，请把苏小姐的药拿来。'\n\n一个穿着职业装的女人走了进来，手中拿着一个药瓶。她的表情很严肃，眼神中带着一丝同情。苏晚注意到她的胸前别着一朵小小的红玫瑰胸针，这让她更加不安。\n\n'这是你的药，周秘书说道，每天三次，饭后服用。'\n\n苏晚接过药瓶，看着里面的白色药片，心中涌起一阵怀疑。她不知道自己是否应该相信这些人，但现在的她别无选择。\n\n谢谢，她说道，声音很轻。\n\n男人和周秘书离开了房间，留下苏晚一个人。她看着手中的药瓶，又看了看床头柜上的红玫瑰，心中充满了疑问和恐惧。\n\n她不知道自己的过去，不知道这些人是否值得信任，也不知道这朵红玫瑰背后隐藏着什么秘密。但有一点是确定的：她必须找回自己的记忆，即使这意味着要面对那些可怕的真相。\n\n苏晚深吸一口气，将药瓶放在床头柜上，然后闭上眼睛，试图在脑海中寻找任何关于过去的线索。但无论她怎么努力，脑海中仍然是一片空白。\n\n她睁开眼睛，看着窗外的阳光，心中暗暗发誓：无论付出什么代价，她都要找回自己的记忆，揭开红玫瑰背后的秘密。"
  },
  {
    id: 2,
    title: "第二章 记忆碎片",
    description: "在医院的第三天，苏晚开始做一些奇怪的梦。梦中总是出现一个穿着血红色斗篷的人影",
    content: "在医院的第三天，苏晚开始做一些奇怪的梦。梦中总是出现一个穿着血红色斗篷的人影"
  },
  {
    id: 3,
    title: "第三章 辐射尘埃",
    description: "周秘书告诉苏晚，她的血液检测显示体内有异常的辐射尘埃含量",
    content: "周秘书告诉苏晚，她的血液检测显示体内有异常的辐射尘埃含量"
  },
  {
    id: 4,
    title: "第四章 发光怀表",
    description: "在病房的抽屉里，苏晚发现了一块会发光的怀表，表盘上刻着奇怪的符号",
    content: "在病房的抽屉里，苏晚发现了一块会发光的怀表，表盘上刻着奇怪的符号"
  },
  {
    id: 5,
    title: "第五章 机械士兵",
    description: "深夜，苏晚听到走廊里传来金属碰撞的声音，她偷偷打开门，看到了令人震惊的一幕",
    content: "深夜，苏晚听到走廊里传来金属碰撞的声音，她偷偷打开门，看到了令人震惊的一幕"
  },
  {
    id: 6,
    title: "第一章 你好你好你好你好你好你好",
    description: "这是一个测试章节，用来验证长标题的显示效果",
    content: "这是一个测试章节，用来验证长标题的显示效果"
  }
];

export default function StoryEditorPage() {
  const [chapters, setChapters] = useState<Chapter[]>(defaultChapters);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(defaultChapters[0]);
  const [fontSize, setFontSize] = useState("15");
  const [algorithmModel, setAlgorithmModel] = useState("gpt-4");
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: selectedChapter.content,
    editable: true,
  });

  useEffect(() => {
    if (editor && selectedChapter.content !== editor.getHTML()) {
      editor.commands.setContent(selectedChapter.content || '');
    }
    // eslint-disable-next-line
  }, [selectedChapter.id]);

  // 打字机逐字显示正文
  const streamContent = async (story_id: number, outline_title: string, content: string) => {
    setIsGenerating(true);
    editor?.commands.setContent('');
    let accumulated = '';
    const response = await fetch(`/api/story_content/generate/${story_id}?outline_title=${outline_title}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_id, outline_title, content }),
    });
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    let fullContent = '';
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        buffer += decoder.decode(value);
        // 尝试解析JSON（流式场景下可能分段）
        let json = null;
        try {
          json = JSON.parse(buffer);
        } catch (e) {
          continue;
        }
        if (json && typeof json.content === 'string') {
          fullContent = json.content;
        }
      }
    }
    // 打字机逐字显示
    const highlightCount = 5;
    if (fullContent) {
      let i = 0;
      const interval = setInterval(() => {
        accumulated += fullContent[i];
        // 计算高亮区
        const start = Math.max(0, accumulated.length - highlightCount);
        const before = accumulated.slice(0, start);
        const highlight = accumulated.slice(start);
        // 用 span 包裹高亮区
        const html = `${before}<span className="gradient-typing">${highlight}</span>`;
        editor?.commands.setContent(html, { emitUpdate: false });
        i++;
        if (i >= fullContent.length) {
          clearInterval(interval);
          setIsGenerating(false);
          // 最后全部普通色
          editor?.commands.setContent(fullContent);
        }
      }, 30);
    } else {
      setIsGenerating(false);
    }
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: chapters.length + 1,
      title: `第${chapters.length + 1}章`,
      description: "新章节描述",
      content: "",
    };
    setChapters(prev => {
      setTimeout(() => {
        // 滚动到新卡片
        const idx = prev.length;
        if (chapterRefs.current[idx]) {
          chapterRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return [...prev, newChapter];
    });
    setSelectedChapter(newChapter);
  };

  const handleDeleteChapter = (id: number) => {
    const updatedChapters = chapters.filter(chapter => chapter.id !== id);
    setChapters(updatedChapters);
    if (selectedChapter.id === id && updatedChapters.length > 0) {
      setSelectedChapter(updatedChapters[0]);
    }
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleContentChange = (content: string) => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === selectedChapter.id
        ? { ...chapter, content }
        : chapter
    );
    setChapters(updatedChapters);
    setSelectedChapter({ ...selectedChapter, content });
  };

  const wordCount = selectedChapter.content.replace(/\s/g, '').length;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">霸道总裁爱上我</h1>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="text-xs">第一人称</Badge>
            <Badge variant="secondary" className="text-xs">女频</Badge>
            <Badge variant="secondary" className="text-xs">字数统计: {wordCount}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="h-5 w-5 text-gray-600" />
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chapter List */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 rounded-l-lg shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pen className="h-5 w-5" style={{ color: 'linear-gradient(90deg, #FF7A00 0%, #A259FF 100%)', background: 'linear-gradient(90deg, #FF7A00 0%, #A259FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              <span className="text-lg font-semibold text-gray-800">章节列表</span>
            </div>
            <button
              onClick={handleAddChapter}
              className="flex items-center gap-1 text-green-500 hover:text-green-600 font-medium text-base px-2 py-1 rounded transition-colors"
              style={{ background: 'none', border: 'none' }}
            >
              <Plus className="h-5 w-5" />
              添加章节
            </button>
          </div>
          <div ref={listRef} className="space-y-3 flex-1 overflow-y-auto min-h-0">
            {chapters.map((chapter, idx) => (
              <div key={chapter.id} ref={el => { chapterRefs.current[idx] = el; }}>
                <Card
                  className={`cursor-pointer transition-colors rounded-lg shadow-sm border-2 ${
                    selectedChapter.id === chapter.id
                      ? 'border-blue-500 bg-white shadow-md'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <CardContent className="p-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {chapter.title}
                        </h3>
                        <button
                          className="flex items-center gap-1 text-green-500 hover:text-green-600 font-medium text-base px-2 py-0 rounded transition-colors border-none bg-none outline-none focus:outline-none"
                          style={{ background: 'none', border: 'none' }}
                          onClick={e => {
                            e.stopPropagation();
                            streamContent(chapter.id, chapter.title, chapter.content);
                          }}
                          disabled={isGenerating}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 2 }}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 2 }}>
                              <path d="M9 2L10.09 6.26L14.18 6.27L10.91 8.74L12 13L9 10.52L6 13L7.09 8.74L3.82 6.27L7.91 6.26L9 2Z" fill="url(#paint0_linear)"/>
                              <defs>
                                <linearGradient id="paint0_linear" x1="3" y1="2" x2="15" y2="13" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#FF7A00"/>
                                  <stop offset="1" stopColor="#A259FF"/>
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>
                          <span>生成正文</span>
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-2">
                        {chapter.description}
                      </p >
                      <div className="flex justify-end space-x-2 mt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 p-1 h-7 w-7"
                          title="编辑章节"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 实现编辑章节功能
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChapter(chapter.id);
                          }}
                          title="删除章节"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white rounded-r-lg shadow-md p-0 relative">
          {/* Editor Toolbar */}
          <div className="border-b border-gray-200 bg-white px-6 py-2 flex items-center gap-2 sticky top-0 z-10">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor?.can().chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'text-green-600 font-bold' : 'text-gray-600'} title="加粗"><Bold className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor?.can().chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'text-green-600 font-bold' : 'text-gray-600'} title="斜体"><Italic className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleStrike().run()} disabled={!editor?.can().chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'text-green-600 font-bold' : 'text-gray-600'} title="删除线"><Strikethrough className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'text-green-600 font-bold' : 'text-gray-600'} title="无序列表"><List className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'text-green-600 font-bold' : 'text-gray-600'} title="有序列表"><ListOrdered className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().undo().run()} className="text-gray-600" title="撤销"><Undo className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().redo().run()} className="text-gray-600" title="重做"><Redo className="h-4 w-4" /></button>
          </div>

          {/* Chapter Title */}
          <div className="px-8 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-left tracking-tight">{selectedChapter.title}</h2>
          </div>

          {/* Text Editor */}
          <div className="flex-1 px-8 pb-8">
            <EditorContent editor={editor} className="w-full h-full min-h-[300px] max-h-[600px] border border-gray-200 rounded-lg p-4 text-gray-800 leading-relaxed shadow-inner focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50" style={{ fontSize: `${fontSize}px` }} />
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
          title="帮助"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}