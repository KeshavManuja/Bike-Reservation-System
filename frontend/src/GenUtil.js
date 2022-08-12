export default class GenUtil {
  static setLoggedInUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static getLoggedInUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static getHeaders() {
    const user = this.getLoggedInUser();
    return {
      headers: {
        jwt: user.token,
      },
    };
  }

  static logOut() {
    localStorage.setItem("user", "");
  }

  static isUserLoggedIn() {
    return !!this.getLoggedInUser();
  }

  static isManager() {
    const user = this.getLoggedInUser();
    return user?.user?.role === "manager";
  }
}
