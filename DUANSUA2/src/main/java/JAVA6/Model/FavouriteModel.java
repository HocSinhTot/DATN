package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "Favourites")
public class FavouriteModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserModel user;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private ProductModel product;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public UserModel getUser() {
		return user;
	}

	public void setUser(UserModel user) {
		this.user = user;
	}

	public ProductModel getProduct() {
		return product;
	}

	public void setProduct(ProductModel product) {
		this.product = product;
	}

	public void setProduct(int id2) {
		// TODO Auto-generated method stub

	}

}