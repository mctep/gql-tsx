import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as Koa from 'koa';
import * as Types from './schema.d';

import { createDirname } from '../../util/dirname';
import { IResolver, Resolvers } from '../../util/graphql/resolver-map';

const dirname = createDirname(__dirname);
const typeDefs = fs.readFileSync(dirname('./schema.gql'), 'utf-8');

const resolvers: Resolvers<
	Koa.Context,
	{
		Query: IResolver<
			Types.Query,
			{
				users: void;
				user: Types.UserQueryArgs;
				me: void;
			}
		>;
	}
> = {
	Query: {
		users: () => [{ id: 1, name: 'user 1', password: 'password 1' }],
		user: () => ({ id: 1, name: 'user 1', password: 'password 1' }),
		me: (_, __, ctx) => ctx.state.user,
	},
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
