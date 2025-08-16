package me.ptakondrej.movieappbackend.auth;

import me.ptakondrej.movieappbackend.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;

	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
		this.refreshTokenRepository = refreshTokenRepository;
	}

	public RefreshToken createRefreshToken(User user) {
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUser(user);
		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
		return refreshTokenRepository.save(refreshToken);
	}

	public RefreshToken verifyExpiration(RefreshToken refreshToken) {
		if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			refreshTokenRepository.delete(refreshToken);
			throw new RuntimeException("Refresh token expired.");
		}
		return refreshToken;
	}

	public Optional<RefreshToken> findByToken(String token) {
		return refreshTokenRepository.findByToken(token);
	}
}
