'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class End extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  End.init({
    title: DataTypes.STRING,
    text: DataTypes.TEXT({ length: 'long' })
  }, {
    sequelize,
    modelName: 'End',
  });
  return End;
};