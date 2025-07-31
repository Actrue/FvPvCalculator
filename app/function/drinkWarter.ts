/**
 * 计算成年人每日所需饮水量（基于美国国家科学院医学研究所公式）
 * @param gender - 性别（'male'或'female'）
 * @param age - 年龄（岁）
 * @param weight - 体重（千克）
 * @param height - 身高（厘米）
 * @param activityFactor - 活动系数（久坐:1.0，轻度:1.12，中度:1.27，剧烈:1.45）
 * @returns {Object} 包含状态、消息和计算结果的对象
 */
export function calculateDailyWaterIntake(
  gender: 'male' | 'female',
  age: number,
  weight: number,
  height: number,
  activityFactor: number
): { states: boolean; message: string; data: number | null } {
  // 参数校验
  if (typeof age !== 'number' || age <= 0) {
    return { states: false, message: '年龄必须为正整数', data: null };
  }
  if (typeof weight !== 'number' || weight <= 0) {
    return { states: false, message: '体重必须为正数值（千克）', data: null };
  }
  if (typeof height !== 'number' || height <= 0) {
    return { states: false, message: '身高必须为正数值（厘米）', data: null };
  }
  if (![1.0, 1.12, 1.27, 1.45].includes(activityFactor)) {
    return { states: false, message: '活动系数必须为1.0/1.12/1.27/1.45', data: null };
  }

  let totalWaterLiters: number;
  try {
    // 区分性别计算总水摄入量（升/天）
    if (gender === 'male') {
      totalWaterLiters = 1.58 - 0.007 * age + 0.024 * weight + 0.018 * height / 100 + 0.203 * activityFactor;
    } else {
      totalWaterLiters = 1.38 - 0.009 * age + 0.024 * weight + 0.014 * height / 100+ 0.144 * activityFactor;
    }
    // 转换为毫升并保留整数
    const totalWaterMl = Math.round(totalWaterLiters * 1000);
    return {
      states: true,
      message: '饮水量计算成功（包含食物和代谢水）',
      data: totalWaterMl
    };
  } catch (error) {
    return { states: false, message: `计算过程出错：${error instanceof Error ? error.message : '未知错误'}`, data: null };
  }
}