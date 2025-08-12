package me.ptakondrej.movieappbackend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<UserDetails> findByUsername(String username);
	Optional<UserDetails> findByEmail(String email);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
}
