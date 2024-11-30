package JAVA6.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import jakarta.persistence.*;
@Entity
@Table(name = "Cart")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private ProductModel product;  // Thay đổi từ int sang ProductModel

    @Column(name = "discount_code_id", nullable = true)
    private Integer  discountCodeId;

    @Column(name = "totalprice", nullable = false)
    private BigDecimal totalPrice;

	@Column(name = "totalquantity", nullable = false)
	private int totalQuantity;

    // Constructor với các tham số (UserModel, ProductModel, int, BigDecimal)
    public CartModel(UserModel user, ProductModel product, int quantity, BigDecimal totalPrice) {
        this.user = user;
        this.product = product;
        this.totalQuantity = quantity;
        this.totalPrice = totalPrice;
        this.discountCodeId = null;  // Mặc định là 0 nếu không có mã giảm giá
    }
    
	
}
