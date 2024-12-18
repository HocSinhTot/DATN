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

    @Column(name = "status")
    private Boolean status;  // Thay đổi kiểu String thành Boolean để phù hợp với kiểu dữ liệu trong cơ sở dữ liệu

    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductModel product;

	@ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;  // Đây là đối tượng User, không phải chỉ là user_id


    @ManyToOne
    @JoinColumn(name = "order_detail_id")
    private OrderDetailModel orderDetail;

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
		return orderDetail;
	}
	
	public void setOrderDetail(OrderDetailModel orderDetail) {
		this.orderDetail = orderDetail;
	}

}