import { PaginateModel } from "mongoose";
import { IUser } from "../../types/user-type.js";
interface IUserModel extends PaginateModel<IUser> {
    findOneByEmail(email: string): Promise<IUser | null>;
}
declare const User: IUserModel;
export default User;
