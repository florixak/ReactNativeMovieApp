package me.ptakondrej.movieappbackend.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/{userId}")
	public String getUserById(
			@PathVariable Long userId
	) {
		return "User data for user with ID: " + userId;
	}

	@PutMapping
	public String updateUser(
			@RequestAttribute ("userId") Long userId,
			@RequestBody User user
	) {
		return "User updated";
	}

	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}



}
