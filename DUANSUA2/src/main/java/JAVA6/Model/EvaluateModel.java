package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Evaluates")
public class EvaluateModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "star", nullable = false)
	private int star;

	@Column(name = "comment", length = 255)
	private String comment;

	@Column(name = "image")
	private String img;

	@ManyToOne
	@JoinColumn(name = "product_id")
	private ProductModel product;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private UserModel user;

	@ManyToOne
	@JoinColumn(name = "order_detail_id")
	private OrderDetailModel order_detail_id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getStar() {
		return star;
	}

	public void setStar(int star) {
		this.star = star;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public ProductModel getProduct() {
		return product;
	}

	public void setProduct(ProductModel product) {
		this.product = product;
	}

	public UserModel getUser() {
		return user;
	}

	public void setUser(UserModel user) {
		this.user = user;
	}
	public OrderDetailModel getOrderDetail() {
		return order_detail_id;
	}
	
	public void setOrderDetail(OrderDetailModel orderDetail) {
		this.order_detail_id = orderDetail;
	}

}