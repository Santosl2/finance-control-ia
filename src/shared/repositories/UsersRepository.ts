import { users } from '@config/db/schema';
import { DrizzleRepository } from './interfaces';

export class UsersRepository extends DrizzleRepository<typeof users> {
	constructor() {
		super(users);
	}
}
