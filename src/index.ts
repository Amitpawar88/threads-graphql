import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(bodyParser.json());

    // Create Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `, // Schema
        resolvers: {
            Query: {
                hello: () => `Hey there!`,
                say: (_, {name}: {name: String}) => `Hey ${name}, How are you?`
            }
        },
    })

    // Start the gql Server
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" });
    });

    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(8000, () => console.log(`Server started at PORT: ${PORT}`)
    );
}

init();