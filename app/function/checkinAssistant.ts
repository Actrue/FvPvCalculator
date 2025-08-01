/**
 * 打卡助手核心函数
 * 提供多事件打卡记录管理、连续打卡统计等功能
 */

// 事件数据结构
export interface CheckinEvent {
  id: string;           // 事件ID
  name: string;         // 事件名称
  description: string;  // 事件描述
  target: {
    daily?: number;     // 每日目标打卡次数
    weekly?: number;    // 每周目标打卡次数
    monthly?: number;   // 每月目标打卡次数
  };
  createdAt: number;    // 创建时间戳
  isActive: boolean;    // 是否激活
}

// 打卡记录数据结构
export interface CheckinRecord {
  eventId: string;      // 关联的事件ID
  date: string;         // 日期 (YYYY-MM-DD格式)
  timestamp: number;    // 打卡时间戳
  completed: boolean;   // 是否完成打卡
}

// 本地存储键名
const EVENTS_STORAGE_KEY = 'checkinAssistantEvents';
const RECORDS_STORAGE_KEY = 'checkinAssistantRecords';

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * 获取所有事件
 * @returns 事件数组
 */
export function getCheckinEvents(): CheckinEvent[] {
  try {
    const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY);
    return eventsStr ? JSON.parse(eventsStr) : [];
  } catch (error) {
    console.error('获取事件失败:', error);
    return [];
  }
}

/**
 * 保存事件
 * @param events 事件数组
 */
export function saveCheckinEvents(events: CheckinEvent[]): void {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('保存事件失败:', error);
  }
}

/**
 * 创建新事件
 * @param name 事件名称
 * @param description 事件描述
 * @param target 目标设置
 * @returns 创建的事件
 */
export function createCheckinEvent(
  name: string, 
  description: string = '', 
  target: { daily?: number; weekly?: number; monthly?: number } = {}
): CheckinEvent {
  const newEvent: CheckinEvent = {
    id: generateId(),
    name,
    description,
    target,
    createdAt: Date.now(),
    isActive: true
  };
  
  const events = getCheckinEvents();
  events.push(newEvent);
  saveCheckinEvents(events);
  
  return newEvent;
}

/**
 * 更新事件
 * @param eventId 事件ID
 * @param updates 更新内容
 * @returns 更新结果
 */
export function updateCheckinEvent(
  eventId: string, 
  updates: Partial<CheckinEvent>
): { success: boolean; message: string; event?: CheckinEvent } {
  try {
    const events = getCheckinEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return { success: false, message: '事件不存在' };
    }
    
    events[eventIndex] = { ...events[eventIndex], ...updates };
    saveCheckinEvents(events);
    
    return { success: true, message: '更新成功', event: events[eventIndex] };
  } catch (error) {
    return { success: false, message: `更新失败: ${error instanceof Error ? error.message : '未知错误'}` };
  }
}

/**
 * 删除事件
 * @param eventId 事件ID
 * @returns 删除结果
 */
export function deleteCheckinEvent(eventId: string): { success: boolean; message: string } {
  try {
    const events = getCheckinEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return { success: false, message: '事件不存在' };
    }
    
    events.splice(eventIndex, 1);
    saveCheckinEvents(events);
    
    // 同时删除该事件的所有打卡记录
    const records = getCheckinRecords();
    const filteredRecords = records.filter(r => r.eventId !== eventId);
    saveCheckinRecords(filteredRecords);
    
    return { success: true, message: '删除成功' };
  } catch (error) {
    return { success: false, message: `删除失败: ${error instanceof Error ? error.message : '未知错误'}` };
  }
}

/**
 * 获取所有打卡记录
 * @returns 打卡记录数组
 */
export function getCheckinRecords(): CheckinRecord[] {
  try {
    const recordsStr = localStorage.getItem(RECORDS_STORAGE_KEY);
    return recordsStr ? JSON.parse(recordsStr) : [];
  } catch (error) {
    console.error('获取打卡记录失败:', error);
    return [];
  }
}

/**
 * 保存打卡记录
 * @param records 打卡记录数组
 */
export function saveCheckinRecords(records: CheckinRecord[]): void {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('保存打卡记录失败:', error);
  }
}

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 * @returns 今天的日期字符串
 */
export function getToday(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * 检查指定事件今天是否已打卡
 * @param eventId 事件ID
 * @returns 今天的打卡记录，如果未打卡则返回 null
 */
export function getTodayCheckinForEvent(eventId: string): CheckinRecord | null {
  const records = getCheckinRecords();
  const today = getToday();
  return records.find(record => record.eventId === eventId && record.date === today) || null;
}

/**
 * 为指定事件打卡或取消打卡
 * @param eventId 事件ID
 * @param completed 是否完成打卡
 * @returns 操作结果
 */
export function toggleCheckinForEvent(eventId: string, completed: boolean = true): { success: boolean; message: string } {
  try {
    const today = getToday();
    const records = getCheckinRecords();
    
    // 查找今天的记录
    const todayIndex = records.findIndex(record => record.eventId === eventId && record.date === today);
    
    if (todayIndex >= 0) {
      // 如果今天已有记录，更新状态
      records[todayIndex].completed = completed;
      records[todayIndex].timestamp = Date.now();
    } else {
      // 如果今天没有记录，添加新记录
      records.push({
        eventId,
        date: today,
        timestamp: Date.now(),
        completed
      });
    }
    
    saveCheckinRecords(records);
    return {
      success: true,
      message: completed ? '打卡成功！' : '已取消打卡'
    };
  } catch (error) {
    return {
      success: false,
      message: `操作失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 计算指定事件的连续打卡天数
 * @param eventId 事件ID
 * @returns 连续打卡天数
 */
export function getConsecutiveCheckinsForEvent(eventId: string): number {
  const records = getCheckinRecords().filter(r => r.eventId === eventId);
  if (records.length === 0) return 0;
  
  // 按日期倒序排列
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
  
  // 从今天开始计算连续打卡天数
  const today = new Date();
  let consecutiveDays = 0;
  const currentDate = new Date(today);
  
  for (let i = 0; i < 365; i++) { // 最多检查一年
    const dateStr = currentDate.toISOString().split('T')[0];
    const record = sortedRecords.find(r => r.date === dateStr);
    
    // 如果找到记录且已完成打卡
    if (record && record.completed) {
      consecutiveDays++;
      currentDate.setDate(currentDate.getDate() - 1); // 检查前一天
    } else {
      // 如果没有记录或未完成打卡，中断连续
      break;
    }
  }
  
  return consecutiveDays;
}

/**
 * 获取指定事件的打卡历史记录
 * @param eventId 事件ID
 * @param limit 限制返回的记录数量，默认为30条
 * @returns 打卡历史记录数组
 */
export function getCheckinHistoryForEvent(eventId: string, limit: number = 30): CheckinRecord[] {
  const records = getCheckinRecords().filter(r => r.eventId === eventId);
  // 按日期倒序排列
  return [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

/**
 * 获取指定事件的月度打卡统计
 * @param eventId 事件ID
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 月度打卡统计信息
 */
export function getMonthlyStatsForEvent(eventId: string, year: number, month: number): {
  totalDays: number;
  checkedDays: number;
  completionRate: number;
} {
  const records = getCheckinRecords().filter(r => r.eventId === eventId);
  
  // 获取指定月份的天数
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
  
  // 筛选指定月份的记录
  const monthRecords = records.filter(record => record.date.startsWith(monthStr));
  
  // 计算已完成打卡的天数
  const checkedDays = monthRecords.filter(record => record.completed).length;
  
  // 计算完成率
  const completionRate = daysInMonth > 0 ? Math.round((checkedDays / daysInMonth) * 100) : 0;
  
  return {
    totalDays: daysInMonth,
    checkedDays,
    completionRate
  };
}

/**
 * 获取所有事件的统计信息
 * @returns 事件统计信息数组
 */
export function getAllEventsStats(): Array<{
  event: CheckinEvent;
  todayCheckin: CheckinRecord | null;
  consecutiveDays: number;
  monthlyStats: { totalDays: number; checkedDays: number; completionRate: number };
}> {
  const events = getCheckinEvents();
  const currentMonth = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;
  
  return events.map(event => ({
    event,
    todayCheckin: getTodayCheckinForEvent(event.id),
    consecutiveDays: getConsecutiveCheckinsForEvent(event.id),
    monthlyStats: getMonthlyStatsForEvent(event.id, year, month)
  }));
}