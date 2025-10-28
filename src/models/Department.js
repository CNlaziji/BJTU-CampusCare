const { DataTypes } = require('sequelize');

// 定义Department模型
let Department;

const DepartmentModel = {
  // 初始化模型
  initiate: (sequelize) => {
    Department = sequelize.define('Department', {
      deptId: {
        field: 'dept_id',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '科室ID'
      },
      deptName: {
        field: 'dept_name',
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '科室名称，唯一约束'
      }
    }, {
      tableName: 'tb_department',
      timestamps: false
    });
    return Department;
  }
};

module.exports = DepartmentModel;