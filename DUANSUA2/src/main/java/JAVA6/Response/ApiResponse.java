package JAVA6.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private boolean success;  // Trạng thái thành công
    private String message;   // Thông báo
    private boolean isAdmin;  // Vai trò admin (nếu có)
    private int userId;       // ID người dùng
    private String token;     // Token JWT (thêm trường này)

    // Constructor mặc định sẽ được Lombok tạo ra nhờ @NoArgsConstructor
}
