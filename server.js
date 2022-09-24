const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull} = require('graphql');
const app = express();

//in memory db
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Represantation of a book",
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    authorId: {type: GraphQLNonNull(GraphQLInt)},
    author: {
      type: AuthorType,
      resolve: (bookObject) => {
        return authors.find(author => author.id === bookObject.authorId )
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Authors name",
  fields: ()=> ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => author.id === book.authorId)
      }
    }
  })
})

const rootQueryType = new GraphQLObjectType({
  name: "TopLevelQuery",
  description: "All parent level queries exist in this top level query",
  fields: () =>  ({
    book: {
      type: BookType,
      description: "just a book",
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      //list of book types
      type: new GraphQLList(BookType),
      description: 'List of books',
      resolve: () => books
    },
    authors: {
      //list of authors
      type: new GraphQLList(AuthorType),
      description: 'List of authors',
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: "just an author",
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent,args) => authors.find(author => author.id === args.id)
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'root mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: "add book path",
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent,args) => {
        const book = {id: books.length + 1, name: args.name, authorId: args.authorId}
        books.push(book)
        return book;
      }

    },
    addAuthor: {
      type: AuthorType,
      description: "add author path",
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
      },
      resolve: (parent,args) => {
        const author = {id: authors.length + 1, name: args.name}
        authors.push(author)
        return author;
      }

    }
  })
})

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: RootMutationType
})

app.listen(5000, () => console.log("Server running on port 5000"))

app.use('/graphql', graphqlHTTP({
  graphiql:  true,
  schema: schema
}))