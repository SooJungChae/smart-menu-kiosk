import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date
  
  type Category {
    _id: ID!
    categoryName: String
  }
  
  type Item {
    _id: ID!
    itemName: String
    itemPrice: Int
    itemImage: String
    itemCategoryId: ID
    createdAt: Date
    category: Category
  }
  
  scalar Upload
  
  type File {
    fileName: String
    fileType: String
    filePath: String
  }
  
  type Mutation {
    addCategory(categoryName: String): ID
    updateCategory(_id: ID, categoryName: String): ID
    deleteCategory(_id: ID): ID
    addItem(itemName: String, itemPrice: Int, itemImage: String, itemCategoryId: ID): Item
    updateItem(_id: ID, itemName: String, itemPrice: Int, itemImage: String, itemCategoryId: ID): Item
    deleteItem(_id: ID): ID
    updateFile(file: Upload): File
  }
  
  type Query {
    categories: [Category]
    item(_id: ID): Item
    items(pageNumber: Int, search: String, itemCategoryId: ID): [Item]
    itemsPageCount(search: String, itemCategoryId: ID): Int
  }
`

export default typeDefs;