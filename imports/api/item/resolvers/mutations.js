import { Categories, Items } from "../collections";
import { getCurrentDate } from "../../../utils/formatDate";

const mutations = {
  async addCategory(_, { categoryName }) {
    const categoryValue = {
      categoryName
    };
    
    try {
      const result = await Categories.insert(categoryValue);
      return result;
    } catch (error) {
      throw `addCategory error: ${error}`;
    }
  },
  async updateCategory(_, { _id, categoryName }) {
    const categoryValue = {
      categoryName
    }
    
    try {
      const result = await Categories.update(
        { _id },
        {$set: categoryValue}
      );
      return result;
    } catch (error) {
      throw `updateCategory error: ${error}`;
    }
  },
  async deleteCategory(_, { _id }) {
    try {
      const result = await Categories.remove(_id);
      return result;
    } catch (error) {
      throw `deleteCategory error: ${error}`;
    }
  },
  
  async addItem(_, {  itemName, itemPrice, itemImage, itemCategoryId }) {
    const newDate = getCurrentDate();
    
    const itemValues = {
      itemName,
      itemPrice,
      itemImage,
      itemCategoryId,
      createdAt: newDate
    };
    
    try {
      const result = await Items.insert(itemValues);
      itemValues._id = result;
      return itemValues;
    } catch (error) {
      throw `addItem error: ${error}`;
    }
  },
  async updateItem(_, {  _id, itemName, itemPrice, itemImage, itemCategoryId }) {
    const itemValues = {
      itemName,
      itemPrice,
      itemImage,
      itemCategoryId,
    };
    
    try {
      await Items.update(
        { _id },
        { $set: categoryValue }
      );
      itemValues._id = _id;
      return itemValues;
    } catch (error) {
      throw `updateItem error: ${error}`;
    }
  },
  async deleteItem(_, { _id }) {
    try {
      await Items.delete(_id);
      return _id;
    } catch (error) {
      throw `deleteItem error: ${error}`;
    }
  },
  
  // async uploadFile(_, args) {
  //   try {
  //     const result = await Items.insert(categoryValue);
  //     return result;
  //   } catch (error) {
  //     throw `uploadFile error: ${error}`;
  //   }
  // },
}

export default mutations;