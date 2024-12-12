package JAVA6.Model;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Products")
public class ProductModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "name", nullable = false, length = 50)
	private String name;

	@Column(name = "describe", length = 255, nullable = false)
	private String description;

	@Column(name = "price", nullable = false, precision = 15, scale = 0)
	private BigDecimal price;

	@Column(name = "quantity", nullable = false)
	private int quantity;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "categories_id", nullable = false)
	private CategoryModel category;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "brand_id", nullable = false)
	
	private BrandModel brand;

	// Phương thức tính giá tổng cộng nếu cần
	public BigDecimal getTotalPrice() {
		return price.multiply(BigDecimal.valueOf(quantity));
	}

	// Getter và Setter cho các trường quan hệ và danh sách
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public CategoryModel getCategory() {
		return category;
	}

	public void setCategory(CategoryModel category) {
		this.category = category;
	}

	public BrandModel getBrand() {
		return brand;
	}

	public void setBrand(BrandModel brand) {
		this.brand = brand;
	}

	public String toString() {
		return "ProductModel{" +
				"id=" + id +
				", name='" + name + '\'' +
				", description='" + description + '\'' +
				", price=" + price +
				", quantity=" + quantity +
				", category=" + (category != null ? category.getName() : "N/A") + // Lấy tên danh mục
				", brand=" + (brand != null ? brand.getName() : "N/A") + // Lấy tên thương hiệu
				'}';
	}

	public List<ImageModel> getImages() {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'getImages'");
	}

    
}