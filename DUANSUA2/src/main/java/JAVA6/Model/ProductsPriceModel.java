package JAVA6.Model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ProductsPrice")
public class ProductsPriceModel {

	@EmbeddedId
	private ProductsPriceId id;

	@ManyToOne
	@MapsId("productId") // Ánh xạ productId trong ProductsImagesId
	@JoinColumn(name = "product_id", nullable = false) // Khóa ngoại tới ProductModel
	private ProductModel product;

	@ManyToOne
	@MapsId("capacityId") // Ánh xạ imageId trong ProductsImagesId
	@JoinColumn(name = "capacity_id", nullable = false) // Khóa ngoại tới ImageModel
	private CapacityModel capacity;

	@ManyToOne
	@MapsId("colorId") // Ánh xạ colorId trong ProductsImagesId
	@JoinColumn(name = "color_id", nullable = false) // Khóa ngoại tới ColorModel
	private ColorModel color;
	@Column(name = "price", nullable = false)
	private double price;

	public ProductsPriceId getId() {
		return id;
	}

	public void setId(ProductsPriceId id) {
		this.id = id;
	}

	public ProductModel getProduct() {
		return product;
	}

	public void setProduct(ProductModel product) {
		this.product = product;
	}

	public CapacityModel getCapacity() {
		return capacity;
	}

	public void setCapacity(CapacityModel capacity) {
		this.capacity = capacity;
	}

	public ColorModel getColor() {
		return color;
	}

	public void setColor(ColorModel color) {
		this.color = color;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	@Embeddable
	@Data
	public static class ProductsPriceId {

		@Column(name = "product_id", nullable = false)
		private int productId;

		@Column(name = "capacity_id", nullable = false)
		private int capacityId;

		@Column(name = "color_id", nullable = false)
		private int colorId;

		public int getProductId() {
			return productId;
		}

		public void setProductId(int productId) {
			this.productId = productId;
		}

		public int getCapacityId() {
			return capacityId;
		}

		public void setCapacityId(int capacityId) {
			this.capacityId = capacityId;
		}

		public int getColorId() {
			return colorId;
		}

		public void setColorId(int colorId) {
			this.colorId = colorId;
		}

	}
	public void setPrice(BigDecimal price) {
		this.price = price.doubleValue();
	}
	
}