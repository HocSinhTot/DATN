package JAVA6.Model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "OrderDetails") 
public class OrderDetailModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private OrderModel order;  // Mối quan hệ với OrderModel

   
    @ManyToOne
    @JoinColumn(name = "product_detail_id", referencedColumnName = "id", nullable = false)
    private ProductDetailsModel product;  // Thay đổi từ int sang ProductModel
    @Column(name = "totalquantity", nullable = false)
	private Integer totalQuantity;
    @Column(name = "totalprice", nullable = false)
    private BigDecimal totalPrice;

}
