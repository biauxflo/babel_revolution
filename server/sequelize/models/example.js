'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Example extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Example.init({
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    text: DataTypes.TEXT({ length: 'long' }),
    decree: DataTypes.INTEGER,
    belief: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Example',
    timestamps: false
  });
  return Example;
};