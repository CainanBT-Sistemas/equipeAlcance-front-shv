import { UserDeleteOrBlockAdapter } from "./UserDeleteOrBlockAdapter"

export class PersonDeleteAdapter {
    idPublic: string = ""
    name: string = ""
    email: string = ""
    user: UserDeleteOrBlockAdapter = new UserDeleteOrBlockAdapter()
}