const { DataTypes } = require('sequelize');

// 定义防抢号日志模型 - 对应 tb_anti_hoarding_log 表
let AntiHoardingLog;

const AntiHoardingLogModel = {
  // 初始化模型
  initiate: (sequelize) => {
    AntiHoardingLog = sequelize.define('AntiHoardingLog', {
      logId: {
        field: 'log_id',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '日志ID'
      },
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '关联 tb_user 的ID（如适用），外键'
      },
      ipAddress: {
        field: 'ip_address',
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: '触发策略的IP地址'
      },
      requestTime: {
        field: 'request_time',
        type: DataTypes.DATE,
        allowNull: false,
        comment: '请求时间'
      },
      logType: {
        field: 'log_type',
        type: DataTypes.ENUM('ip_limit', 'frequency_limit', 'other'),
        allowNull: false,
        comment: '日志类型: ip_limit(IP限制), frequency_limit(频次限制), other(其他)'
      }
    }, {
      tableName: 'tb_anti_hoarding_log',
      timestamps: false
    });
    
    return AntiHoardingLog;
  },
  // 获取AntiHoardingLog模型实例
  getModel: () => AntiHoardingLog
};


module.exports = AntiHoardingLogModel;