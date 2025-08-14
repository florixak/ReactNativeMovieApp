package me.ptakondrej.movieappbackend.responses;

import me.ptakondrej.movieappbackend.user.UserDTO;

public class LoginResponse extends Response {

	private UserDTO user;
	private String token;
	private long expiresIn;

	public LoginResponse(boolean success, UserDTO user, String token, long expiresIn, String message) {
		super(success, message);
		this.user = user;
		this.token = token;
		this.expiresIn = expiresIn;
	}

	public UserDTO getUser() {
		return user;
	}

	public void setUser(UserDTO user) {
		this.user = user;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public long getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(long expiresIn) {
		this.expiresIn = expiresIn;
	}
}
