package JAVA6.Model;

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
    @JoinColumn(name = "color_id", nullable = false) // Khóa ngoại tới ColorModel
    private ColorModel color;

    @ManyToOne
    @JoinColumn(name = "product_price_id", nullable = false) // Khóa ngoại tới ProductsPriceModel
    private ProductsPriceModel productPrice;

    @Column(name = "totalquantity", nullable = false)
    private int totalQuantity;
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public ProductModel getProduct() {
        return product;
    }

    public void setProduct(ProductModel product) {
        this.product = product;
    }

    public ColorModel getColor() {
        return color;
    }

    public void setColor(ColorModel color) {
        this.color = color;
    }

    public ProductsPriceModel getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(ProductsPriceModel productPrice) {
        this.productPrice = productPrice;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
}
