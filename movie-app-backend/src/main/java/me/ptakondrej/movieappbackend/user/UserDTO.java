package me.ptakondrej.movieappbackend.user;

public class UserDTO {

	private Long id;
	private String username;
	private String email;
	private boolean verified;

	public UserDTO() {}

	public UserDTO(Long id, String username, String email, boolean verified) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.verified = verified;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}
}
