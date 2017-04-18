import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  Note,
  User,
  addNote,
  getNote,
  getNotes,
  getUser,
  getViewer,
  deleteNote,
  editNote,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Note') {
      return getNote(id);
    } else if (type === 'User') {
      return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Note) {
      return GraphQLNote;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLNote = new GraphQLObjectType({
  name: 'Note',
  fields: {
    id: globalIdField('Note'),
    message: {
      type: GraphQLString,
      resolve: (obj) => obj.message,
    },
    created: {
      type: GraphQLInt,
      resolve: (obj) => obj.created,
    }   
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: NotesConnection,
  edgeType: GraphQLNoteEdge,
} = connectionDefinitions({
  name: 'Note',
  nodeType: GraphQLNote,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      resolve: (obj) => obj.name,
    },   
    notes: {
      type: NotesConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, ...args) =>
        connectionFromArray(getNotes(), args),
    },
    totalCount: {
      type: GraphQLInt,
      resolve: () => getNotes().length,
    },
  },
  interfaces: [nodeInterface],
});

const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

const AddNoteMutation = mutationWithClientMutationId({
  name: 'AddNote',
  inputFields: {
    message: { type: new GraphQLNonNull(GraphQLString) },
    created: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    noteEdge: {
      type: GraphQLNoteEdge,
      resolve: ({localNoteId}) => {
        const note = getNote(localNoteId);
        return {
          cursor: cursorForObjectInConnection(getNotes(), note),
          node: note,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({message, created}) => {
    const localNoteId = addNote(message, created);
    return {localNoteId};
  },
});

const DeleteNoteMutation = mutationWithClientMutationId({
  name: 'DeleteNote',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedNoteId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localNoteId = fromGlobalId(id).id;
    deleteNote(localNoteId);
    return {id};
  },
});

const EditNoteMutation = mutationWithClientMutationId({
  name: 'EditNote',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    message: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    note: {
      type: GraphQLNote,
      resolve: ({localNoteId}) => getNote(localNoteId),
    },
  },
  mutateAndGetPayload: ({id, message}) => {
    const localNoteId = fromGlobalId(id).id;
    editNote(localNoteId, message);
    return {localNoteId};
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNote: AddNoteMutation,
    deleteNote: DeleteNoteMutation,
    editNote: EditNoteMutation,
  },
});

export const Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
