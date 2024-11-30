package JAVA6.config;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Định nghĩa đường dẫn API bạn muốn cấu hình CORS
            .allowedOrigins("http://localhost:3000") // URL của frontend
            .allowedMethods("GET", "POST", "PUT", "DELETE","OPTIONS") // Các phương thức HTTP cho phép
            .allowedHeaders("*") // Các headers cho phép
            .allowCredentials(true);
    }
    
    
}
