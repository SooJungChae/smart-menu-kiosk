import { Orders } from './collections';
import { getCurrentDate } from "../../utils/formatDate";
import { PubSub, withFilter } from "graphql-subscriptions";
import { ORDER_ADDED, ADMIN } from "../../utils/constants";
import { getUser } from 'meteor/apollo';

const pubsub = new PubSub;

const queries = {
  async orders(_, args, context, info) {
    try {
      const result = await Orders.find({
        // $gte: 오늘날짜 이후 데이터만 나타나도록 만드는 옵션.
        orderDate: { "$gte": new Date() }
      });
      return result;
    } catch (error) {
      throw `Orders Query Error: ${error}`;
    }
  }
}

const mutations = {
  async addOrder(_, { orderPriceSum, orderCount, orderItems }, { user }, info) {
    const newDate = getCurrentDate();
    
    const orderValues = {
      orderPriceSum,
      orderCount,
      orderItems,
      orderState: false,
      orderDate: newDate
    }
  
    // console.log(Orders);
  
    try {
      const result = await Orders.insert(orderValues);
      
      orderValues._id = result;
      await pubsub.publish(ORDER_ADDED, { orderAdded: orderValues });
      
      return result;
    } catch (error) {
      throw `Order Add Error: ${error}`;
    }
  },
  
  async checkOrder(_, { _id, orderState }, { user }, info) {
    const changeOrderState = {
      orderState: !orderState
    };
    
    try {
      await Orders.update(
        {_id, $set: changeOrderState}
      )
      
      return _id;
    } catch (error) {
      throw `checkOrder Update Error: ${error}`;
    }
  }
}

const subscriptions = withFilter(
  () => pubsub.asyncIterator(ORDER_ADDED),
  // payload: 전달되는 정보, variables: 클라에서 요청할때 매개변수로 전달하는 정보
  async (payload, variables) => {
    const getUserRole = await getUser(variables.authToken);
    const checkRole = getUserRole.profile.role === ADMIN;
    return checkRole;
  })

const resolvers = {
  Query: queries,
  Mutation: mutations,
  Subscription: subscriptions
}

export default resolvers;