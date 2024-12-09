package JAVA6.config;

import JAVA6.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;

    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token)) {
            try {
                // Lấy username và roles từ token
                String username = JwtTokenUtil.getUsernameFromToken(token);
                String roles = (String) JwtTokenUtil.getClaimsFromToken(token).get("roles");

                // Chuyển đổi roles thành danh sách quyền
                List<SimpleGrantedAuthority> authorities = Collections.emptyList();
                if (roles != null) {
                    authorities = List.of(roles.split(",")).stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                }

                // Tạo Authentication và đặt vào SecurityContext
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                System.err.println("Invalid token: " + e.getMessage());
            }
        }

        // Tiếp tục chuỗi filter
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
