package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;


import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UsersRepository userRepository;


    public UserModel saveUser(UserModel user) {
        return userRepository.save(user);
    }

    public UserModel findByUsername(String username) {
        return (UserModel) userRepository.findByUsername(username);
    }

    public UserModel findByEmail(String email) {
        return (UserModel) userRepository.findByEmail(email);
    }

    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    public UserModel getUserById(int userId) {
        Optional<UserModel> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null); // Trả về UserModel nếu tồn tại, hoặc null nếu không
    }

    public ResponseEntity<String> blockUser(int id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(false); // Đặt trạng thái blocked
                    userRepository.save(user);
                    return ResponseEntity.ok("User blocked successfully.");
                })
                .orElse(ResponseEntity.status(404).body("User not found."));
    }

    public ResponseEntity<String> unblockUser(int id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(true); // Đặt trạng thái active
                    userRepository.save(user);
                    return ResponseEntity.ok("User unblocked successfully.");
                })
                .orElse(ResponseEntity.status(404).body("User not found."));
    }

    public boolean isUserBlocked(int userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return !user.isStatus(); // Kiểm tra trạng thái tài khoản (false = blocked)
    }
}