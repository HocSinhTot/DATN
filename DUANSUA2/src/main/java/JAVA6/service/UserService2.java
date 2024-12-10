package JAVA6.service;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService2 implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm người dùng từ CSDL theo username
        UserModel user = usersRepository.findByUsername(username).stream().findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Kiểm tra quyền của người dùng và trả về đối tượng UserDetails
        return User.withUsername(user.getUsername())
                .password(user.getPassword())  // Lưu ý: Mật khẩu đã mã hóa sẽ cần dùng PasswordEncoder
                .roles(user.isRole() ? "ADMIN" : "USER")  // Nếu user.isRole() là true, thì user là ADMIN
                .build();
    }
}
