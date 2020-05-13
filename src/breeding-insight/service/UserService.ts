import {User} from "@/breeding-insight/model/User";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import {Role} from "@/breeding-insight/model/Role";
import {Vue} from "vue-property-decorator";
import {BiResponse} from "@/breeding-insight/model/BiResponse";

export class UserService {

  static duplicateEmailMessage : string = 'Email is already in use.';
  static errorCreateUser: string = 'Unable to create user';
  static errorDeleteUser: string = 'Unable to delete user';
  static errorGetUsers: string = 'Error while trying to load roles';
  static errorDeleteUserNotFound: string = 'Unable to find user to delete';
  static errorPermissionsEditUser: string = "You don't have permissions to edit this user.";

  static getUserInfo(): Promise<User> {

    return new Promise<User>((resolve, reject) => {
      UserDAO.getUserInfo().then((biResponse: BiResponse) => {
        const result: any = biResponse.result;
        const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
        const user = new User(result.id, result.name, result.orcid, result.email, role);
        resolve(user);
      }).catch((error: any) => reject(error));
    });
  }

  static create(user: User): Promise<User> {
    //TODO: Check everything is good
    return new Promise<User>((resolve, reject) => {

      if (user.id === undefined) {
        const systemRoles = [];
        if (user.roleId) { systemRoles.push(new Role(user.roleId)) }

        UserDAO.create(user, systemRoles).then((biResponse) => {
          const result: any = biResponse.result;
          const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
          const newUser = new User(result.id, result.name, result.orcid, result.email, role);
          resolve(newUser);

        }).catch((error) => {
          if (error.response && error.response.status === 409) {
            Vue.$log.info('Email already exists');
            error['errorMessage'] = this.duplicateEmailMessage;
          } else {
            Vue.$log.fatal(error);
            error['errorMessage'] = this.errorCreateUser;
          }
          reject(error);
        });
      }
      else {
        reject();
      }

    });
  }

  static update(user: User): Promise<User> {
    //TODO: Check everything is good
    return new Promise<User>((resolve, reject) => {

      if (user.id) {
        UserDAO.update(user.id, user).then((biResponse) => {
          const result: any = biResponse.result;
          const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
          const newUser = new User(result.id, result.name, result.orcid, result.email, role);
          resolve(newUser);

        }).catch((error) => {
          if (error.response && error.response.status === 409) {
            Vue.$log.info('Email already exists');
            error['errorMessage'] = this.duplicateEmailMessage;
          } else {
            Vue.$log.fatal(error);
            error['errorMessage'] = this.errorCreateUser;
          }
          reject(error);
        });
      }
      else {
        reject();
      }
    });
  }

  static delete(user: User): Promise<any> {

    return new Promise<any>(((resolve, reject) => {

      if (user.id){
        return UserDAO.delete(user.id)
          .then(() => resolve())
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              error['errorMessage'] = this.errorDeleteUserNotFound;
            } else {
              error['errorMessage'] = this.errorDeleteUser;
            }
            reject(error)
          });
      } else {
        reject();
      }

    }))
  }

  static getAll(): Promise<User[]> {
    return new Promise<User[]>(((resolve, reject) => {

      UserDAO.getAll().then((biResponse) => {

        // Parse our users into the vue users param
        const users = biResponse.result.data.map((user: any) => {
          const role: Role | undefined = this.parseSystemRoles(user.systemRoles);
          return new User(user.id, user.name, user.orcid, user.email, role);
        });

        resolve(users);

      }).catch((error) => {
        error['errorMessage'] = this.errorGetUsers;
        reject(error)
      });

    }));
  }

  static updateSystemRoles(user: User): Promise<User> {

    return new Promise<User>((resolve, reject) => {

      if (user.id) {
        const systemRoles = [];
        if (user.roleId) { systemRoles.push(new Role(user.roleId)) }

        UserDAO.updateSystemRoles(user.id, systemRoles).then((biResponse) => {
          const result: any = biResponse.result;
          const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
          const newUser = new User(result.id, result.name, result.orcid, result.email, role);
          resolve(newUser);

        }).catch((error) => {
          if (error.response && error.response.status === 403) {
            Vue.$log.info('Unable to edit own roles');
            error['errorMessage'] = this.errorPermissionsEditUser;
          } else {
            Vue.$log.fatal(error);
            error['errorMessage'] = this.errorCreateUser;
          }
          reject(error)
        });

        return;
      }
      reject();
    });
  }

  private static parseSystemRoles(systemRoles: any[]): Role | undefined {
    if (systemRoles && systemRoles.length > 0){
      return new Role(systemRoles[0].id, systemRoles[0].domain);
    }
    return undefined;
  }

}