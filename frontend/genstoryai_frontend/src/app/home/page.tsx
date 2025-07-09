import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Plus, 
  FileText, 
  Settings, 
  Calendar,
  Star
} from 'lucide-react';
import { GenStorySidebar } from '../../components/genstory-sidebar';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';

export default function HomePage() {
  const navigate = useNavigate();

  // 模拟数据 - 在实际应用中这些数据应该从API获取
  const stats = [
    {
      title: "总故事数",
      value: "12",
      description: "已创建的故事",
      icon: BookOpen,
      trend: "+2 本月",
      color: "text-blue-600"
    },
    {
      title: "创作时间",
      value: "48h",
      description: "累计创作时间",
      icon: Clock,
      trend: "+12h 本周",
      color: "text-green-600"
    },
    {
      title: "完成度",
      value: "85%",
      description: "故事完成率",
      icon: TrendingUp,
      trend: "+5% 本月",
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      title: "《魔法森林的冒险》",
      description: "更新了第3章",
      time: "2小时前",
      type: "update"
    },
    {
      title: "《星际旅行》",
      description: "创建了新故事",
      time: "昨天",
      type: "create"
    },
    {
      title: "《古代传说》",
      description: "完成了第5章",
      time: "3天前",
      type: "complete"
    }
  ];

  const quickActions = [
    {
      title: "创建新故事",
      description: "开始一个新的创作",
      icon: Plus,
      action: () => navigate('/create-story'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "我的故事",
      description: "查看所有故事",
      icon: FileText,
      action: () => navigate('/stories'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "设置",
      description: "账户和偏好设置",
      icon: Settings,
      action: () => navigate('/settings'),
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <GenStorySidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* 页面标题 */}
              <div className="flex items-center justify-between space-y-2 px-4 lg:px-6">
                <h2 className="text-3xl font-bold tracking-tight">仪表板</h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {stat.trend}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-7 lg:px-6">
                {/* Quick Actions */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>快速操作</CardTitle>
                    <CardDescription>
                      开始您的创作之旅
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          onClick={action.action}
                          className={`h-auto p-4 flex flex-col items-center gap-2 text-white ${action.color} transition-colors`}
                        >
                          <action.icon className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-xs opacity-90">{action.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>最近活动</CardTitle>
                    <CardDescription>
                      您的最新创作动态
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="mt-1">
                            {activity.type === 'create' && (
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                            {activity.type === 'update' && (
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                            )}
                            {activity.type === 'complete' && (
                              <div className="h-2 w-2 rounded-full bg-purple-500" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.description}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {activity.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Featured Story */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    推荐故事
                  </CardTitle>
                  <CardDescription>
                    基于您的阅读偏好推荐
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">《魔法森林的冒险》</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        一个关于勇气和友谊的奇幻故事，讲述了一个小女孩在魔法森林中的冒险经历...
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">奇幻</Badge>
                        <Badge variant="outline">冒险</Badge>
                        <span className="text-xs text-gray-400">3章 • 2小时前更新</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      继续阅读
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}