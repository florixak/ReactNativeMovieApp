package me.ptakondrej.movieappbackend.user;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@GetMapping("/{userId}")
	public String getUserById(
			@PathVariable Long userId
	) {
		return "User data for user with ID: " + userId;
	}

	@GetMapping
	public String getUsers(
	) {
		return "List of users";
	}

	@PostMapping
	public String createUser(
			@RequestBody User user
	) {
		return "User created";
	}

	@PutMapping
	public String updateUser(
			@RequestAttribute ("userId") Long userId,
			@RequestBody User user
	) {
		return "User updated";
	}



}
