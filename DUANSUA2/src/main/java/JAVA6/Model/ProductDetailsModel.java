package JAVA6.Model;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ProductDetail")
public class ProductDetailsModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false) // Khóa ngoại tới ProductModel
    private ProductModel product;

    @ManyToOne
    @JoinColumn(name = "product_color_id", nullable = false) // Khóa ngoại tới ColorModel
    private ColorModel color;

    @ManyToOne
    @JoinColumn(name = "product_price_id", nullable = false) // Khóa ngoại tới ProductsPriceModel
    private ProductsPriceModel productPrice;

    @Column(name = "totalquantity", nullable = false)
    private int totalQuantity;

    public BigDecimal getPrice() {
        return productPrice != null ? productPrice.getPrice() : BigDecimal.ZERO;
    }

    // Phương thức để lấy thông tin về dung lượng
    public String getCapacity() {
        return productPrice != null ? productPrice.getCapacity().getName() : "Không xác định";
    }
    public int getCapacityy() {
        return productPrice != null ? productPrice.getCapacity().getId() : null;
    }

    // Phương thức setColor với kiểu ColorModel
    public void setColor(ColorModel color) {
        this.color = color;
    }

    // Phương thức setProductPrice với kiểu ProductsPriceModel
    public void setProductPrice(ProductsPriceModel productPrice) {
        this.productPrice = productPrice;
    }
}
