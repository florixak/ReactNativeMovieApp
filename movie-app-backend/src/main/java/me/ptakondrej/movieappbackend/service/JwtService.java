package me.ptakondrej.movieappbackend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Service
public class JwtService {

	@Value("${security.jwt.secret-key}")
	private String secretKey;

	@Value("${security.jwt.expiration-time}")
	private long expirationTime;

	/**
	 * Extracts the username from the JWT token.
	 * @param token the JWT token
	 * @return the username extracted from the token
	 */
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	/**
	 * Extracts a claim from the JWT token.
	 *
	 * @param token          the JWT token
	 * @param claimsResolver a function to resolve the claim
	 * @param <T>            the type of the claim
	 * @return the resolved claim
	 */
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	/**
	 * Generates a JWT token for the given user details.
	 *
	 * @param userDetails the user details
	 * @return the generated JWT token
	 */
	public String generateToken(UserDetails userDetails) { return generateToken(new HashMap<>(), userDetails);}

	/**
	 * Generates a JWT token with additional claims for the given user details.
	 *
	 * @param extraClaims  additional claims to include in the token
	 * @param userDetails  the user details
	 * @return the generated JWT token
	 */
	public String generateToken(
		HashMap<String, Object> extraClaims,
		UserDetails userDetails
	) {
		return buildToken(extraClaims, userDetails, expirationTime);
	}

	/**
	 * Returns the expiration time of the JWT token.
	 * @return the expiration time in milliseconds
	 */
	public long getExpirationTime() {
		return expirationTime;
	}

	/**
	 * Builds a JWT token with the specified claims, user details, and expiration time.
	 *
	 * @param extraClaims   additional claims to include in the token
	 * @param userDetails   the user details
	 * @param expirationTime the expiration time in milliseconds
	 * @return the generated JWT token
	 */
	private String buildToken(
		HashMap<String, Object> extraClaims,
		UserDetails userDetails,
		long expirationTime
	) {
		return Jwts.builder()
				.setClaims(extraClaims)
				.setSubject(userDetails.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + expirationTime))
				.signWith(getSignInKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	/**
	 * Validates the JWT token against the provided user details.
	 *
	 * @param token       the JWT token
	 * @param userDetails the user details to validate against
	 * @return true if the token is valid, false otherwise
	 */
	public boolean isTokenValid(String token, UserDetails userDetails) {
		try {
			final String emailFromToken = extractUsername(token);
			return (emailFromToken.equals(userDetails.getUsername()) && !isTokenExpired(token));
		} catch (Exception e) {
			System.out.println("Token validation error: " + e.getMessage());
			return false;
		}
	}

	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	/**
	 * Extracts the expiration date from the JWT token.
	 *
	 * @param token the JWT token
	 * @return the expiration date
	 */
	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	/**
	 * Extracts all claims from the JWT token.
	 *
	 * @param token the JWT token
	 * @return the claims extracted from the token
	 */
	public Claims extractAllClaims(String token) {
		return Jwts.parser()
				.setSigningKey(getSignInKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	/**
	 * Retrieves the signing key used to sign the JWT token.
	 *
	 * @return the signing key
	 */
	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}

}
