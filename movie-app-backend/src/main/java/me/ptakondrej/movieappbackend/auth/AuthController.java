package me.ptakondrej.movieappbackend.auth;

import me.ptakondrej.movieappbackend.responses.LoginResponse;
import me.ptakondrej.movieappbackend.responses.RegisterResponse;
import me.ptakondrej.movieappbackend.responses.Response;
import me.ptakondrej.movieappbackend.service.AuthService;
import me.ptakondrej.movieappbackend.service.JwtService;
import me.ptakondrej.movieappbackend.user.User;
import me.ptakondrej.movieappbackend.user.UserDTO;
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
	public ResponseEntity<RegisterResponse> signUp(@RequestBody RegisterUserDTO registerUserDTO) {
		try {
			User user = authService.signUp(registerUserDTO);
			UserDTO userDTO = new UserDTO(
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					false
			);
			RegisterResponse registerResponse = new RegisterResponse(
					true,
					userDTO,
					"Registration successful. Please verify your email."
			);
			return ResponseEntity.ok(registerResponse);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new RegisterResponse(false, null, e.getMessage()));
		}
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDTO loginUserDTO) {
		try {
			User authenticatedUser = authService.authenticate(loginUserDTO);
			HashMap<String, Object> userDetails = new HashMap<>();
			userDetails.put("userId", authenticatedUser.getId());
			userDetails.put("username", authenticatedUser.getUsername());
			userDetails.put("email", authenticatedUser.getEmail());
			userDetails.put("enabled", authenticatedUser.isEnabled());
			String token = jwtService.generateToken(userDetails, authenticatedUser);
			UserDTO userDTO = new UserDTO(
					authenticatedUser.getId(),
					authenticatedUser.getUsername(),
					authenticatedUser.getEmail(),
					authenticatedUser.isEnabled()
			);
			LoginResponse loginResponse = new LoginResponse(true, userDTO, token, jwtService.getExpirationTime(), "Login successful");
			return ResponseEntity.ok(loginResponse);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new LoginResponse(false,null, null, -1, e.getMessage()));
		}
	}

	@PostMapping("/verify")
	public ResponseEntity<Response> verifyUser(@RequestBody VerifyUserDTO verifyUserDTO) {
		try {
			authService.verifyUser(verifyUserDTO);
			return ResponseEntity.ok(new Response(true, "User verified successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new Response(false, e.getMessage()));
		}
	}

	@PostMapping("/resend")
	public ResponseEntity<Response> resendVerificationEmail(@RequestBody String email) {
		try {
			authService.resendVerificationEmail(email);
			return ResponseEntity.ok(new Response(true, "Verification email resent successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new Response(false, e.getMessage()));
		}
	}
}
