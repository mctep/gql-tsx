import { GraphQLResolveInfo } from 'graphql';

type Resolver<Root, Args, Context, Result> = (
	root: Root,
	args: Args,
	context: Context,
	info: GraphQLResolveInfo,
) => Promise<Result | null> | Result | null;

export interface IResolver<Root, ArgsMap> {
	root: Root;
	argsMap: ArgsMap;
}

type QueryDeclaration<C, R, Q extends {[P in keyof R]: {}}> = {
	[P in keyof (Q | R)]: Resolver<R, Q[P], C, R[P]>;
};

export type Resolvers<C,
	Q extends { [key: string]: IResolver<any, any> }
> = {
	[P in keyof Q]: QueryDeclaration<C, Q[P]['root'], Q[P]['argsMap']>
};
