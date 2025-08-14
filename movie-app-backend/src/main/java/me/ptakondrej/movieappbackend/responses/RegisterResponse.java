package me.ptakondrej.movieappbackend.responses;

import me.ptakondrej.movieappbackend.user.UserDTO;

public class RegisterResponse extends Response {

	private UserDTO user;

	public RegisterResponse(boolean success, UserDTO user, String message) {
		super(success, message);
		this.user = user;
	}

	public UserDTO getUser() {
		return user;
	}

	public void setUser(UserDTO user) {
		this.user = user;
	}
}
