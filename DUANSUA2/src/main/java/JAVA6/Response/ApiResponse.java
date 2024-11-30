package JAVA6.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông báo
    private boolean isAdmin; // Vai trò admin (nếu có)
    private int userId;
    public ApiResponse() {
    }
    
}