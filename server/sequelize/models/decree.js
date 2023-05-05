'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Decree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Decree.init({
    title: DataTypes.STRING,
    text: DataTypes.TEXT({ length: 'long' })
  }, {
    sequelize,
    modelName: 'Decree',
  });
  return Decree;
};