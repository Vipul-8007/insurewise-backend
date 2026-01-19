import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Application {
    id: ID!
    businessName: String
    businessType: String
    state: String
    revenue: Float
    experience: Int
    coverageLimit: Float
    deductible: Float
    riskLevel: String
    basePremium: Float
    finalPremium: Float
    createdAt: String
  }

  input ApplicationInput {
    businessName: String!
    businessType: String!
    state: String!
    revenue: Float!
    experience: Int!
    coverageLimit: Float!
    deductible: Float!
    riskLevel: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    myApplication: [Application]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createApplication(input: ApplicationInput!): Application
  }
`;

export default typeDefs;
