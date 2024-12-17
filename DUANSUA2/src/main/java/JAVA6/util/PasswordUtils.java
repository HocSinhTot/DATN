package JAVA6.util;

import org.springframework.security.crypto.bcrypt.BCrypt;

public class PasswordUtils {

    // Mã hóa mật khẩu bằng BCrypt
    public static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    // Kiểm tra mật khẩu với mật khẩu đã mã hóa
    public static boolean verifyPassword(String password, String hashedPassword) {
        return BCrypt.checkpw(password, hashedPassword);
    }
}
