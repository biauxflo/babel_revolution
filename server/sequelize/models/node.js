'use strict';
const {
  Model, DataTypes
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Node extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  DataTypes.LONGTEXT = DataTypes.STRING;
  Node.init({
    author: DataTypes.STRING,
    // text: DataTypes.LONGTEXT,
    text: DataTypes.TEXT({ length: 'long' }),
    react: DataTypes.INTEGER,
    belief: DataTypes.STRING,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Node',
  });
  return Node;
};
