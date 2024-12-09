package JAVA6.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.security.Key;

@Component
public class JwtTokenUtil {

    // Update this to a key that is at least 256 bits (32 bytes) for HS256
    private static final String SECRET_KEY = "your-256-bit-secret-key-which-is-long-enough-for-HS256"; // 32 bytes = 256 bits

    // Generate a secure key of sufficient size for HS256
    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generate token
    public static String generateToken(String username, boolean isAdmin) {
        return Jwts.builder()
                .setSubject(username)
                .claim("isAdmin", isAdmin)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token expires in 1 hour
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign using HS256
                .compact();
    }

    // Get claims from the token
    public static Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey()) // Use the secure signing key
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Get username from the token
    public static String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    // Get admin flag from the token
    public static boolean getAdminFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("isAdmin", Boolean.class);
    }

    // Validate the token based on username
    public static boolean validateToken(String token, String username) {
        String tokenUsername = getUsernameFromToken(token);
        return tokenUsername.equals(username); // Also check if token is expired
    }
}
    // Check if the token has expired
