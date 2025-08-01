'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { 
  getCheckinEvents,
  createCheckinEvent,
  updateCheckinEvent,
  deleteCheckinEvent,
  getTodayCheckinForEvent,
  toggleCheckinForEvent,
  getConsecutiveCheckinsForEvent,
  getCheckinHistoryForEvent,
  getMonthlyStatsForEvent,
  getAllEventsStats
} from '../../function/checkinAssistant';
import { CheckinEvent, CheckinRecord } from '../../function/checkinAssistant';
// import { getAllEventsStats } from '../../function/checkinAssistant';  // 移除未使用的导入

const CheckinAssistant = () => {
  // 事件相关状态
  const [events, setEvents] = useState<CheckinEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CheckinEvent | null>(null);
  
  // 打卡相关状态
  const [todayCheckin, setTodayCheckin] = useState<CheckinRecord | null>(null);
  const [consecutiveDays, setConsecutiveDays] = useState<number>(0);
  const [history, setHistory] = useState<CheckinRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<{ 
    totalDays: number; 
    checkedDays: number; 
    completionRate: number 
  } | null>(null);
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  
  // 表单状态
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [dailyTarget, setDailyTarget] = useState<number | undefined>(undefined);
  const [weeklyTarget, setWeeklyTarget] = useState<number | undefined>(undefined);
  const [monthlyTarget, setMonthlyTarget] = useState<number | undefined>(undefined);

  // 初始化数据
  useEffect(() => {
    loadEvents();
  }, []); // 仅在组件挂载时执行一次
 const loadDataForEvent = useCallback((eventId: string) => {
    // 获取今天的打卡状态
    const todayRecord = getTodayCheckinForEvent(eventId);
    setTodayCheckin(todayRecord);
    
    // 获取连续打卡天数
    const consecutive = getConsecutiveCheckinsForEvent(eventId);
    setConsecutiveDays(consecutive);
    
    // 获取打卡历史记录
    const historyRecords = getCheckinHistoryForEvent(eventId, 30);
    setHistory(historyRecords);
    
    // 获取月度统计
    const stats = getMonthlyStatsForEvent(
      eventId,
      currentMonth.year,
      currentMonth.month
    );
    setMonthlyStats(stats);
  }, [currentMonth.year, currentMonth.month]);
  // 当选中事件或月份变化时加载数据
  useEffect(() => {
    if (selectedEventId) {
      loadDataForEvent(selectedEventId);
    }
  }, [selectedEventId, currentMonth, loadDataForEvent]); // 添加 loadDataForEvent 到依赖数组

  const loadEvents = useCallback(() => {
    const eventsList = getCheckinEvents();
    setEvents(eventsList);
    
    // 如果没有选中事件且有事件存在，选择第一个事件
    if (!selectedEventId && eventsList.length > 0) {
      setSelectedEventId(eventsList[0].id);
    }
  }, [selectedEventId]);

 

  const handleCheckin = () => {
    if (!selectedEventId) return;
    
    const result = toggleCheckinForEvent(selectedEventId, !todayCheckin?.completed);
    if (result.success) {
      loadDataForEvent(selectedEventId); // 重新加载数据
    } else {
      alert(result.message);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth.month === 1) {
      setCurrentMonth({ year: currentMonth.year - 1, month: 12 });
    } else {
      setCurrentMonth({ ...currentMonth, month: currentMonth.month - 1 });
    }
  };

  const handleNextMonth = () => {
    if (currentMonth.month === 12) {
      setCurrentMonth({ year: currentMonth.year + 1, month: 1 });
    } else {
      setCurrentMonth({ ...currentMonth, month: currentMonth.month + 1 });
    }
  };

  // 事件操作
  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      alert('请输入事件名称');
      return;
    }
    
    const target = {
      daily: dailyTarget,
      weekly: weeklyTarget,
      monthly: monthlyTarget
    };
    
    const newEvent = createCheckinEvent(eventName, eventDescription, target);
    setEvents([...events, newEvent]);
    setSelectedEventId(newEvent.id);
    
    // 重置表单
    resetEventForm();
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !eventName.trim()) {
      alert('请输入事件名称');
      return;
    }
    
    const target = {
      daily: dailyTarget,
      weekly: weeklyTarget,
      monthly: monthlyTarget
    };
    
    const result = updateCheckinEvent(editingEvent.id, {
      name: eventName,
      description: eventDescription,
      target
    });
    
    if (result.success && result.event) {
      const updatedEvents = events.map(e => 
        e.id === editingEvent.id ? result.event! : e
      );
      setEvents(updatedEvents);
      if (selectedEventId === editingEvent.id) {
        loadDataForEvent(selectedEventId);
      }
    } else {
      alert(result.message);
    }
    
    // 重置表单
    resetEventForm();
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!window.confirm('确定要删除这个事件吗？')) {
      return;
    }
    
    const result = deleteCheckinEvent(eventId);
    if (result.success) {
      const updatedEvents = events.filter(e => e.id !== eventId);
      setEvents(updatedEvents);
      
      // 如果删除的是当前选中的事件，选择第一个事件或清空选中
      if (selectedEventId === eventId) {
        if (updatedEvents.length > 0) {
          setSelectedEventId(updatedEvents[0].id);
        } else {
          setSelectedEventId(null);
          resetData();
        }
      }
    } else {
      alert(result.message);
    }
  };

  const resetEventForm = () => {
    setEventName('');
    setEventDescription('');
    setDailyTarget(undefined);
    setWeeklyTarget(undefined);
    setMonthlyTarget(undefined);
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const resetData = () => {
    setTodayCheckin(null);
    setConsecutiveDays(0);
    setHistory([]);
    setMonthlyStats(null);
  };

  const openCreateForm = () => {
    resetEventForm();
    setShowEventForm(true);
  };

  const openEditForm = (event: CheckinEvent) => {
    setEditingEvent(event);
    setEventName(event.name);
    setEventDescription(event.description);
    setDailyTarget(event.target.daily);
    setWeeklyTarget(event.target.weekly);
    setMonthlyTarget(event.target.monthly);
    setShowEventForm(true);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  // 获取选中的事件
  // const selectedEvent = events.find(e => e.id === selectedEventId) || null;  // 移除未使用的变量

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">打卡助手</h1>
      
      {/* 事件管理 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">事件管理</h2>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            创建事件
          </button>
        </div>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedEventId === event.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedEventId(event.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.name}</h3>
                    {event.description && (
                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.target.daily && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          日:{event.target.daily}
                        </span>
                      )}
                      {event.target.weekly && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          周:{event.target.weekly}
                        </span>
                      )}
                      {event.target.monthly && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          月:{event.target.monthly}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(event);
                      }}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">暂无事件，请创建第一个事件</p>
        )}
      </div>

      {/* 事件表单 */}
      {showEventForm && (
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingEvent ? '编辑事件' : '创建事件'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                事件名称 *
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入事件名称"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                事件描述
              </label>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入事件描述"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  每日目标
                </label>
                <input
                  type="number"
                  value={dailyTarget || ''}
                  onChange={(e) => setDailyTarget(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="每日打卡次数"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  每周目标
                </label>
                <input
                  type="number"
                  value={weeklyTarget || ''}
                  onChange={(e) => setWeeklyTarget(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="每周打卡次数"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  每月目标
                </label>
                <input
                  type="number"
                  value={monthlyTarget || ''}
                  onChange={(e) => setMonthlyTarget(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="每月打卡次数"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={resetEventForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                取消
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                {editingEvent ? '更新事件' : '创建事件'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 打卡区域 */}
      {selectedEventId && (
        <>
          {/* 今日打卡状态 */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">今日打卡</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg">今天是 {formatDate(new Date().toISOString().split('T')[0])}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {todayCheckin?.completed ? '已打卡' : '尚未打卡'}
                  {todayCheckin?.completed && ` (${new Date(todayCheckin.timestamp).toLocaleTimeString('zh-CN')})`}
                </p>
              </div>
              <button
                onClick={handleCheckin}
                className={`px-6 py-3 rounded-md text-white font-medium transition duration-200 ${
                  todayCheckin?.completed 
                    ? 'bg-gray-500 hover:bg-gray-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {todayCheckin?.completed ? '取消打卡' : '立即打卡'}
              </button>
            </div>
          </div>

          {/* 连续打卡统计 */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">连续打卡</h2>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{consecutiveDays}</p>
              <p className="text-gray-600 mt-2">连续打卡天数</p>
            </div>
          </div>

          {/* 月度统计 */}
          <div className="mb-8 p-6 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">月度统计</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handlePrevMonth}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {'<'}
                </button>
                <span className="px-3 py-1">
                  {currentMonth.year}年{currentMonth.month}月
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {'>'}
                </button>
              </div>
            </div>
            {monthlyStats && (
              <div>
                <div className="flex justify-between mb-2">
                  <span>完成率</span>
                  <span>{monthlyStats.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-purple-600 h-4 rounded-full" 
                    style={{ width: `${monthlyStats.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>已打卡 {monthlyStats.checkedDays} 天</span>
                  <span>总计 {monthlyStats.totalDays} 天</span>
                </div>
              </div>
            )}
          </div>

          {/* 打卡历史 */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">打卡历史</h2>
            {history.length > 0 ? (
              <ul className="space-y-3">
                {history.map((record) => (
                  <li 
                    key={`${record.eventId}-${record.date}`} 
                    className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm"
                  >
                    <span>{formatDate(record.date)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      record.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.completed ? '已打卡' : '未打卡'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无打卡记录</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CheckinAssistant;