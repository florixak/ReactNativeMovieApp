package me.ptakondrej.movieappbackend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.movieappbackend.service.JwtService;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	private final HandlerExceptionResolver handlerExceptionResolver;
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	public JwtAuthFilter(HandlerExceptionResolver handlerExceptionResolver, JwtService jwtService, UserDetailsService userDetailsService) {
		this.handlerExceptionResolver = handlerExceptionResolver;
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request,
									@NonNull HttpServletResponse response,
									@NonNull FilterChain filterChain) throws ServletException, IOException {
		String requestPath = request.getRequestURI();

		if (requestPath.startsWith("/api/auth/")) {
			filterChain.doFilter(request, response);
			return;
		}

		final String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			final String jwt = authHeader.substring(7);
			final String username = jwtService.extractUsername(jwt);
			System.out.println("JWT: " + jwt);
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (username != null && authentication == null) { // if user is not authenticated and userEmail is not null
				System.out.println("not authenticated, loading user details for email: " + username);
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);

				if (jwtService.isTokenValid(jwt, userDetails)) {
					Long userId = jwtService.extractClaim(jwt, claims -> claims.get("userId", Long.class));
					request.setAttribute("userId", userId);
					System.out.println("User ID from JWT: " + userId);

					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken
									(userDetails,
									null,
											userDetails.getAuthorities());
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				} else {
					System.out.println("JWT is invalid or expired for user: " + username);
				}
			}

			filterChain.doFilter(request, response);

		} catch (Exception e) {
			System.out.println("Exception in JwtAuthFilter: " + e.getMessage());
			handlerExceptionResolver.resolveException(request, response, null, e);
		}
	}
}
