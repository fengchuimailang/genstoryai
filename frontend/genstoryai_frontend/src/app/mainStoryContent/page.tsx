'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { getStoryById, createStoryContent, getStoryContent, updateStoryContent } from '@/api/story-api';
import { toast } from 'sonner';
import { useStoryStore } from '../../lib/store';
import { Loading } from '@/components/ui/loading';

interface Chapter {
  id: number;
  title: string;
  description: string;
  content: string;
  story_content_id?: number | null;
}


export default function StoryEditorPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();
  const [fontSize, setFontSize] = useState("15");
  const [algorithmModel, setAlgorithmModel] = useState("gpt-4");
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: selectedChapter?.content || '',
    editable: true,
  });
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { currentStory } = useStoryStore();
  // 章节内容缓存，避免重复请求
  const contentCache = useRef<Record<number, string>>({});
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // 页面加载时获取章节列表
  useEffect(() => {
    async function fetchChapters(storyId) {
      setIsPageLoading(true);
      const data = await getStoryById(storyId);
      // 适配后端返回格式，outline为章节数组
      if (Array.isArray(data.outline.itemList) && data.outline.itemList.length > 0) {
        const mappedChapters = data.outline.itemList.map((item, idx) => ({
          id: idx + 1,
          title: item.title,
          description: item.content || '',
          content: '',
          story_content_id: item.story_content_id ?? null,
        }));
        // 如果第一章节有story_content_id，拉取内容
        if (mappedChapters[0]?.story_content_id) {
          const contentData = await getStoryContent(mappedChapters[0].story_content_id);
          mappedChapters[0].content = contentData.content || '';
          contentCache.current[mappedChapters[0].story_content_id] = contentData.content || '';
        }
        setChapters(mappedChapters);
        setSelectedChapter({ ...mappedChapters[0] });
        // 新增：首次拉取后立即同步到editor
        setTimeout(() => {
          if (editor && mappedChapters[0].content) {
            editor.commands.setContent(mappedChapters[0].content);
          }
        }, 0);
      }
      setIsPageLoading(false);
    }
    if (currentStory?.id) {
      fetchChapters(currentStory.id);
    }
  }, [currentStory?.id]);

  // 切换章节时终止动画并同步内容
  useEffect(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    async function fetchChapterContent() {
      if (selectedChapter?.story_content_id) {
        // 优先用缓存
        const cached = contentCache.current[selectedChapter.story_content_id];
        if (cached !== undefined) {
          setSelectedChapter(prev => prev ? { ...prev, content: cached } : prev);
          editor?.commands.setContent(cached);
          setIsContentLoading(false);
        } else if (selectedChapter?.content === '') {
          setIsContentLoading(true);
          try {
            const contentData = await getStoryContent(selectedChapter.story_content_id);
            contentCache.current[selectedChapter.story_content_id] = contentData.content || '';
            setSelectedChapter(prev => prev ? { ...prev, content: contentData.content || '' } : prev);
            editor?.commands.setContent(contentData.content || '');
          } catch (e: any) {
            toast.error(typeof e === 'string' ? e : e?.message || '章节内容加载失败');
          } finally {
            setIsContentLoading(false);
          }
        }
      } else if (editor && selectedChapter) {
        editor.commands.setContent(selectedChapter.content || '');
        setIsContentLoading(false);
      }
      setIsGenerating(false);
    }
    fetchChapterContent();
  }, [selectedChapter?.id]);

  // 打字机逐字显示正文
  const streamContent = async (story_id: number, outline_title: string, content: string) => {
    setIsGenerating(true);
    setIsContentLoading(true);
    editor?.commands.setContent('');
    let accumulated = '';
    try {
      const response = await fetch(`/api/story_content/generate/${story_id}?outline_title=${outline_title}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id, outline_title, content }),
      });
      if (!response.body) throw new Error('无响应数据');
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
      const highlightCount = 5;
      if (fullContent) {
        let i = 0;
        typingIntervalRef.current && clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = setInterval(() => {
          accumulated += fullContent[i];
          const start = Math.max(0, accumulated.length - highlightCount);
          const before = accumulated.slice(0, start);
          const highlight = accumulated.slice(start);
          const html = `${before}<span class="gradient-typing">${highlight}</span>`;
          editor?.commands.setContent(html, { emitUpdate: false });
          i++;
          if (i >= fullContent.length) {
            typingIntervalRef.current && clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            setIsGenerating(false);
            editor?.commands.setContent(fullContent);
            setChapters(prev => prev.map(chap => chap.id === story_id ? { ...chap, content: fullContent } : chap));
            setSelectedChapter(prev => prev && prev.id === story_id ? { ...prev, content: fullContent } : prev);
            // 缓存生成内容
            if (selectedChapter?.story_content_id) {
              contentCache.current[selectedChapter.story_content_id] = fullContent;
            }
            setIsContentLoading(false);
          }
        }, 30);
      } else {
        setIsGenerating(false);
        setIsContentLoading(false);
      }
    } catch (e: any) {
      toast.error(typeof e === 'string' ? e : e?.message || '生成正文失败');
      setIsGenerating(false);
      setIsContentLoading(false);
    }
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: chapters.length + 1,
      title: `第${chapters.length + 1}章`,
      description: "新章节描述",
      content: "",
      story_content_id: null,
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
    setEditingChapterId(newChapter.id);
    setEditTitle(newChapter.title);
    setEditDesc(newChapter.description);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditTitle(chapter.title);
    setEditDesc(chapter.description);
  };

  const handleSaveChapter = async (chapter: Chapter) => {
    if (!editTitle.trim() || !editDesc.trim()) {
      toast.error('标题和描述不能为空');
      return;
    }
    setIsSaving(true);
    try {
      if (!chapter.story_content_id) {
        // 新建
        const res = await createStoryContent({
          story_id: currentStory.id,
          outline_title: editTitle,
          content: chapter.content,
        });
        setChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, title: editTitle, description: editDesc, story_content_id: res.id } : c));
        if (selectedChapter?.id === chapter.id) setSelectedChapter({ ...chapter, title: editTitle, description: editDesc, story_content_id: res.id });
      } else {
        // 修改
        await updateStoryContent(chapter.story_content_id, {
          outline_title: editTitle,
          content: chapter.content,
        });
        setChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, title: editTitle, description: editDesc } : c));
        if (selectedChapter?.id === chapter.id) setSelectedChapter({ ...chapter, title: editTitle, description: editDesc });
      }
      setEditingChapterId(null);
      toast.success('保存成功');
    } catch (e: any) {
      toast.error(typeof e === 'string' ? e : e?.message || '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChapter = (id: number) => {
    // const updatedChapters = chapters.filter(chapter => chapter.id !== id);
    // setChapters(updatedChapters);
    // if (selectedChapter.id === id && updatedChapters.length > 0) {
    //   setSelectedChapter(updatedChapters[0]);
    // }
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

  const wordCount = selectedChapter?.content?.replace(/\s/g, '').length || 0;

  // 假设 storyId 固定为 1，可根据实际传参
  const handleSave = async () => {
    if (!selectedChapter || !currentStory?.id) return;
    setIsSaving(true);
    setIsPageLoading(true);
    try {
      if (!selectedChapter.story_content_id) {
        // 新建
        const res = await createStoryContent({
          story_id: currentStory.id,
          outline_title: selectedChapter.title,
          content: editor?.getText() || '',
        });
        // 更新章节story_content_id
        setChapters(prev => prev.map(chap => chap.id === selectedChapter.id ? { ...chap, story_content_id: res.id } : chap));
        setSelectedChapter(prev => prev ? { ...prev, story_content_id: res.id } : prev);
        toast.success('保存成功');
      } else {
        // 修改
        await updateStoryContent(selectedChapter.story_content_id, {
          outline_title: selectedChapter.title,
          content: editor?.getText() || '',
        });
        toast.success('保存成功');
      }
    } catch (e: any) {
      toast.error(typeof e === 'string' ? e : e?.message || '保存失败');
    } finally {
      setIsSaving(false);
      setIsPageLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {isPageLoading && (
        <div className="loading-overlay">
          <Loading size="lg" text="加载中..." />
        </div>
      )}
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
        <div className="w-90 border-r border-gray-200 bg-gray-50 p-4 rounded-l-lg shadow-md flex flex-col">
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
                        <div className="flex-1 min-w-0">
                          {editingChapterId === chapter.id ? (
                            <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="font-semibold text-gray-900 text-base truncate" placeholder="请输入章节标题" />
                          ) : (
                            <h3 className="font-semibold text-gray-900 text-base truncate">{chapter.title}</h3>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-7 w-7"
                            onClick={e => {
                              e.stopPropagation();
                              if (editingChapterId === chapter.id) {
                                handleSaveChapter(chapter);
                              } else {
                                handleEditChapter(chapter);
                              }
                            }}
                            disabled={isSaving}
                            title={editingChapterId === chapter.id ? '保存' : '编辑章节'}
                          >
                            {editingChapterId === chapter.id ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <Edit className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-7 w-7"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteChapter(chapter.id);
                            }}
                            title="删除章节"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {editingChapterId === chapter.id ? (
                        <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full text-gray-600 text-sm mb-2 rounded border border-gray-300 p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-200" rows={3} placeholder="章节描述" />
                      ) : (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-2">{chapter.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white rounded-r-lg shadow-md p-0 relative">
          {isContentLoading && !isPageLoading && (
            <div className="loading-block-overlay">
              <Loading size="md" text="章节内容加载中..." />
            </div>
          )}
          {/* Editor Toolbar */}
          <div className="border-b border-gray-200 bg-white px-6 py-2 flex items-center gap-2 sticky top-0 z-10">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor?.can().chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'text-green-600 font-bold' : 'text-gray-600'} title="加粗"><Bold className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor?.can().chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'text-green-600 font-bold' : 'text-gray-600'} title="斜体"><Italic className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleStrike().run()} disabled={!editor?.can().chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'text-green-600 font-bold' : 'text-gray-600'} title="删除线"><Strikethrough className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'text-green-600 font-bold' : 'text-gray-600'} title="无序列表"><List className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'text-green-600 font-bold' : 'text-gray-600'} title="有序列表"><ListOrdered className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().undo().run()} className="text-gray-600" title="撤销"><Undo className="h-4 w-4" /></button>
            <button onClick={() => editor?.chain().focus().redo().run()} className="text-gray-600" title="重做"><Redo className="h-4 w-4" /></button>
            <div className="flex-1" />
            <button
              className="ml-4 px-6 py-2 rounded-full text-white font-bold text-base"
              style={{
                background: 'linear-gradient(90deg, #22b07d 0%, #3ad6a5 100%)',
                minWidth: 80,
              }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : (selectedChapter?.story_content_id ? '保存修改' : '保存')}
            </button>
          </div>

          {/* Chapter Title */}
          <div className="px-8 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-left tracking-tight">{selectedChapter?.title || ''}</h2>
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