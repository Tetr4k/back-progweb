class User {
	constructor(firstName, lastName, email, firstLogin){
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.firstLogin = firstLogin;
	}

	get fullName() {
		return `{${this.firstName} ${this.lastName}}`;
	}
}

export default User;