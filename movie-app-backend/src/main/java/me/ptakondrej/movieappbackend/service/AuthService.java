package me.ptakondrej.movieappbackend.service;

import jakarta.mail.MessagingException;
import me.ptakondrej.movieappbackend.auth.LoginUserDTO;
import me.ptakondrej.movieappbackend.auth.RegisterUserDTO;
import me.ptakondrej.movieappbackend.auth.VerifyUserDTO;
import me.ptakondrej.movieappbackend.user.User;
import me.ptakondrej.movieappbackend.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final EmailService emailService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.emailService = emailService;
	}

	public User signUp(RegisterUserDTO registerUserDTO) {
		User user = new User();
		user.setUsername(registerUserDTO.getUsername());
		user.setEmail(registerUserDTO.getEmail());
		user.setPassword(passwordEncoder.encode(registerUserDTO.getPassword()));
		user.setVerificationCode(generateVerificationCode());
		user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
		user.setEnabled(false);
		sendVerificationEmail(user);
		return userRepository.save(user);
	}

	public User authenticate(LoginUserDTO input) {
		User user;

		if (input.getUsernameOrEmail() == null || input.getPassword() == null) {
			throw new RuntimeException("Email and password must not be null.");
		}

		if (input.getUsernameOrEmail().contains("@")) {
			user = userRepository.findByEmail(input.getUsernameOrEmail())
					.orElseThrow(() -> new RuntimeException("User not found with email: " + input.getUsernameOrEmail()));
		} else {
			user = userRepository.findByUsername(input.getUsernameOrEmail())
					.orElseThrow(() -> new RuntimeException("User not found with username: " + input.getUsernameOrEmail()));
		}

		/*if (!user.isEnabled()) {
			throw new RuntimeException("User account is not verified.");
		}*/

		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
				input.getUsernameOrEmail(),
				input.getPassword()
		));

		return user;
	}

	public void verifyUser(VerifyUserDTO verifyUserDTO) {
		User user = userRepository.findByEmail(verifyUserDTO.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found with email: " + verifyUserDTO.getEmail()));

		if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Verification code has expired.");
		}

		System.out.println("Verification code: " + user.getVerificationCode());
		System.out.println("provided code: " + verifyUserDTO.getVerificationCode());

		if (!user.getVerificationCode().equals(verifyUserDTO.getVerificationCode())) {
			throw new RuntimeException("Invalid verification code.");
		}

		user.setEnabled(true);
		user.setVerificationCode(null);
		user.setVerificationCodeExpiresAt(null);
		userRepository.save(user);
	}

	public void resendVerificationEmail(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		if (user.isEnabled()) {
			throw new RuntimeException("User account is already verified.");
		}

		user.setVerificationCode(generateVerificationCode());
		user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
		userRepository.save(user);
		sendVerificationEmail(user);
	}

	public void sendVerificationEmail(User user) {
		String subject = "Account Verification";
		String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
		String htmlMessage = "<html>"
				+ "<body style=\"font-family: Arial, sans-serif;\">"
				+ "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
				+ "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
				+ "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
				+ "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
				+ "<h3 style=\"color: #333;\">Verification Code:</h3>"
				+ "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
				+ "</div>"
				+ "</div>"
				+ "</body>"
				+ "</html>";
		try {
			emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	private String generateVerificationCode() {
		Random random = new Random();
		String code;
		do {
			int randomCode = random.nextInt(999999) + 100000;
			code = String.format("%06d", randomCode);
		} while (userRepository.existsByVerificationCode(code));

		return code;
	}


}
