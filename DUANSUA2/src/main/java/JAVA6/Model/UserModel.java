package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Data
@Entity
@Table(name = "Users")
public class UserModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "username", nullable = false, length = 255)
	private String username;

	@Column(name = "password", nullable = false, length = 255)
	private String password;

	@Column(name = "email", nullable = false, length = 255, unique = true)
	private String email;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "birthday", nullable = false)
	private Date birthday;

	@Column(name = "phone", nullable = false, length = 15, unique = true)
	private String phone;

	@Column(name = "role", nullable = false)
	private boolean role;

	@Column(name = "status", nullable = false)
	private boolean status;

	@Column(name = "image")
	private String image;

	@Column(name = "gender", nullable = false)
	private boolean gender;

	// Các getter và setter khác...
	public boolean isRole() {
		return role;
	}

	public void setRole(boolean role) {
		this.role = role;
	}

	// Phương thức khóa tài khoản
	public void blockAccount() {
		this.status = false; // Đặt status = 0 (khóa tài khoản)
	}

	// Phương thức mở khóa tài khoản
	public void unblockAccount() {
		this.status = true; // Đặt status = 1 (mở khóa tài khoản)
	}

	// Thêm phương thức setActive
	public void setActive(boolean active) {
		this.status = active;
	}

	// // Phương thức getDiscountCode chưa được triển khai, bỏ qua nếu không cần
	// thiết
	// public String getDiscountCode() {
	// // TODO Auto-generated method stub
	// throw new UnsupportedOperationException("Unimplemented method
	// 'getDiscountCode'");
	// }
}
