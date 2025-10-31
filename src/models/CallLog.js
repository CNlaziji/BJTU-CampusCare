const { DataTypes } = require('sequelize');

// 定义叫号日志模型 - 对应 tb_call_log 表
let CallLog;

const CallLogModel = {
  // 初始化模型
  initiate: (sequelize) => {
    CallLog = sequelize.define('CallLog', {
      logId: {
        field: 'log_id',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '日志ID'
      },
      apptId: {
        field: 'appt_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '关联 tb_appointment 的ID，外键'
      },
      doctorId: {
        field: 'doctor_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '关联 tb_doctor 的ID，外键'
      },
      operation: {
        field: 'operation',
        type: DataTypes.ENUM('called', 'missed', 'completed'),
        allowNull: false,
        comment: '操作类型: called(叫号), missed(过号), completed(接诊完成)'
      },
      operationTime: {
        field: 'operation_time',
        type: DataTypes.DATE,
        allowNull: false,
        comment: '操作时间'
      }
    }, {
      tableName: 'tb_call_log',
      timestamps: false
    });

    return CallLog;
  },
  // 获取CallLog模型实例
  getModel: () => CallLog
};

module.exports = CallLogModel;