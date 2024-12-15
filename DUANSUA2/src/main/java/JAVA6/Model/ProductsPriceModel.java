package JAVA6.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ProductsPrice")
public class ProductsPriceModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private ProductModel product;

    @ManyToOne
    @JoinColumn(name = "capacity_id", referencedColumnName = "id", nullable = false)
    private CapacityModel capacity;

    @Column(name = "price", nullable = false) // Định dạng tiền tệ
    private BigDecimal price;

    // Getter and Setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter and Setter for product
    public ProductModel getProduct() {
        return product;
    }

    public void setProduct(ProductModel product) {
        this.product = product;
    }

    // Getter and Setter for capacity
    public CapacityModel getCapacity() {
        return capacity;
    }

    public void setCapacity(CapacityModel capacity) {
        this.capacity = capacity;
    }

    // Getter and Setter for price
    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
