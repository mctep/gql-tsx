/*
This file was automatically generated
Please do not change it
*/

/* tslint:disable */

export interface Query {
	user: User | null;
	users: Array<User> | null;
	me: User | null;
}

export interface UserQueryArgs {
	id: number;
}

export interface User {
	id: number;
	name: string | null;
	password: string | null;
}
