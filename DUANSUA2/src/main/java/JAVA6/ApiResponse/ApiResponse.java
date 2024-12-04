package JAVA6.ApiResponse;

public class ApiResponse {
    private boolean success;
    private String message;
    private boolean isAdmin;
    private int userId;
    private String redirectUrl;

    // Constructor với 5 tham số
    public ApiResponse(boolean success, String message, boolean isAdmin, int userId, String redirectUrl) {
        this.success = success;
        this.message = message;
        this.isAdmin = isAdmin;
        this.userId = userId;
        this.redirectUrl = redirectUrl;
    }

    // Getter và Setter cho success
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    // Getter và Setter cho message
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Getter và Setter cho isAdmin
    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    // Getter và Setter cho userId
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    // Getter và Setter cho redirectUrl
    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
