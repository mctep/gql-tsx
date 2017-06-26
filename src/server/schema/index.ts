import * as fs from 'fs';
import * as Koa from 'koa';
import { makeExecutableSchema } from 'graphql-tools';
import * as Types from './schema.d';

import { createDirname } from '../../util/dirname';
import { IResolver, Resolvers } from '../../util/graphql/resolver-map';

const dirname = createDirname(__dirname);
const typeDefs = fs.readFileSync(dirname('./schema.gql'), 'utf-8');

const resolvers: Resolvers<Koa.Context, {
	Query: IResolver<Types.Query, {
		users: void;
		user: Types.UserQueryArgs;
		me: void;
	}>,
}> = {
	Query: {
		users: () => ([{ id: 1 }]) as Array<Types.User>,
		user: () => ({ id: 1 }) as Types.User,
		me: (_, __, ctx) => ({ id: ctx.state.user.id }) as Types.User,
	},
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
