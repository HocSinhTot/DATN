package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "OrderStatus")
public class OrderStatusModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "status", nullable = false, length = 50)
	private String status;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}