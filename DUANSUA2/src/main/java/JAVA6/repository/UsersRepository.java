package JAVA6.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.UserModel;
import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<UserModel, Integer> {
    List<UserModel> findByUsername(String username);

    List<UserModel> findByEmail(String email);

    // Kiểm tra tồn tại username, email, hoặc số điện thoại
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    // Tìm người dùng theo trạng thái (kích hoạt/khóa)
    List<UserModel> findAllByStatus(boolean status);
}
