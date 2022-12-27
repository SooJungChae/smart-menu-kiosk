import { Mongo } from 'meteor/mongo';

const Categories = new Mongo.Collection('category');
const Items = new Mongo.Collection('item');

export {
  Categories,
  Items
}