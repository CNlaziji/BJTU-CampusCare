const { DataTypes } = require('sequelize');

// 定义Doctor模型
let Doctor;

const DoctorModel = {
  // 初始化模型
  initiate: (sequelize) => {
    Doctor = sequelize.define('Doctor', {
      doctorId: {
        field: 'doctor_id',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '医生ID'
      },
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        comment: '关联 tb_user 的ID，外键且唯一'
      },
      deptId: {
        field: 'dept_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '关联 tb_department 的ID，外键'
      },
      title: {
        field: 'title',
        type: DataTypes.STRING,
        comment: '职称'
      }
    }, {
      tableName: 'tb_doctor',
      timestamps: false
    });

    return Doctor;
  },
  // 获取Doctor模型实例
  getModel: () => Doctor
};

module.exports = DoctorModel;