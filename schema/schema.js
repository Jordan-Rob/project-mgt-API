const { projects, clients } = require('../sampleData')

const Client = require('../models/Client')
const Project = require('../models/Project')

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql')

//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type:GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
})

// Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        client: { 
            type: ClientType,  
            resolve(parent, args){
                return Client.findById(parent.clientID)
            } 
        },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: { type:GraphQLID }},
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type:GraphQLID }},
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        }
    }
})

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Client Mutations
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                const newClient = Client.create({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })

                return newClient
            }
        },
        deleteClient: {
            type: ClientType,
            args: { 
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id)
            }
        },
        //Project Mutations
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: { 
                    type: new GraphQLEnumType({
                            name: 'ProjectStatus',
                            values: {
                                'new': { value: 'Not Started' },
                                'progress': { value: 'In Progress' },
                                'completed': { value: 'Completed' }
                            }
                        }),
                    defaultValue: 'Not Started'
                },
                clientID: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                const newProject = Project.create({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientID: args.clientID
                })

                return newProject
            }
        },
        deleteProject: {
            type: ProjectType,
            args: { 
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})