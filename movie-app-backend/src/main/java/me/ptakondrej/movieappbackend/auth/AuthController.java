package me.ptakondrej.movieappbackend.auth;

import me.ptakondrej.movieappbackend.service.AuthService;
import me.ptakondrej.movieappbackend.service.JwtService;
import me.ptakondrej.movieappbackend.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final JwtService jwtService;
	private final AuthService authService;

	public AuthController(JwtService jwtService, AuthService authService) {
		this.jwtService = jwtService;
		this.authService = authService;
	}

	@PostMapping("/signup")
	public ResponseEntity<User> signUp(@RequestBody RegisterUserDTO registerUserDTO) {
		User user = authService.signUp(registerUserDTO);
		return ResponseEntity.ok(user);
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDTO loginUserDTO) {
		User authenticatedUser = authService.authenticate(loginUserDTO);
		HashMap<String, Object> userDetails = new HashMap<>();
		userDetails.put("userId", authenticatedUser.getId());
		userDetails.put("username", authenticatedUser.getUsername());
		userDetails.put("email", authenticatedUser.getEmail());
		userDetails.put("enabled", authenticatedUser.isEnabled());
		String token = jwtService.generateToken(userDetails, authenticatedUser);
		LoginResponse loginResponse = new LoginResponse(token, jwtService.getExpirationTime());
		return ResponseEntity.ok(loginResponse);
	}

	@PostMapping("/verify")
	public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDTO verifyUserDTO) {
		try {
			authService.verifyUser(verifyUserDTO);
			return ResponseEntity.ok("Account verified successfully.");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/resend")
	public ResponseEntity<?> resendVerificationEmail(@RequestBody String email) {
		try {
			authService.resendVerificationEmail(email);
			return ResponseEntity.ok("Verification email resent successfully.");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
