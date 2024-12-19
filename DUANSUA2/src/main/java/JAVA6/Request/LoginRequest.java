
package JAVA6.Request;

public class LoginRequest {
    private String username;
    private String password;
    private String rememberMe;

    // Constructor mặc định
    public LoginRequest() {
    }

    // Constructor với các tham số
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getter và Setter cho username
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Getter và Setter cho password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(String rememberMe) {
        this.rememberMe = rememberMe;
    }
    // Phương thức toString (tuỳ chọn) để dễ dàng kiểm tra giá trị của đối tượng
    @Override
    public String toString() {
        return "LoginRequest{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
