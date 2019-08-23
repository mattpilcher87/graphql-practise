const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type:GraphQLString},
    name: {type:GraphQLString},
    email: {type:GraphQLString},
    age: {type:GraphQLInt}
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type:GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // Return all customers
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data)
      }
    },
    // TODO
    // customerbyage: {
    //   type: CustomerType,
    //   args: {
    //     age: {type:GraphQLInt}
    //   },
    //   resolve(parentValue, args) {
    //     axios.get('http://localhost:3000/customers/')
    //       .then(res => {
    //         let results = []
    //         console.log(res.data)
    //         for(let i = 0; i < res.data.length; i++) {
    //           if (res.data[i].age === args.age) {
    //             console.log(res.data[i])
    //             results.push(res.data[i])
    //           }
    //         }
    //         console.log('---results', results)
    //         return results
    //       })
    //   }
    // }
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer:{
      type: CustomerType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)}, // required
        email: {type: new GraphQLNonNull(GraphQLString)}, // required
        age: {type: new GraphQLNonNull(GraphQLInt)} // required
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          name:args.name,
          email:args.email,
          age:args.age
        })
          .then(res => res.data)
      }
    },
    deleteCustomer:{
      type: CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)} // required
      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/'+args.id)
          .then(res => res.data)
      }
    },
    editCustomer:{
      type: CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)}, // required
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/'+args.id, args)
          .then(res => res.data)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});