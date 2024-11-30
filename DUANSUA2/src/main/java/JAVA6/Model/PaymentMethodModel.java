package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "PaymentMethods")
public class PaymentMethodModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "methods", nullable = false, length = 50)
	private String methods;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getMethods() {
		return methods;
	}

	public void setMethods(String methods) {
		this.methods = methods;
	}

}