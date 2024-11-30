package JAVA6.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ProductsImages")
public class ProductsImagesModel {

    @EmbeddedId
    private ProductsImagesId id;


    @ManyToOne
    @MapsId("productId") // Ánh xạ productId trong ProductsImagesId
    @JsonBackReference 
    @JoinColumn(name = "product_id", nullable = false) // Khóa ngoại tới ProductModel
    private ProductModel product;

    @ManyToOne
    @MapsId("imageId") // Ánh xạ imageId trong ProductsImagesId
    @JoinColumn(name = "image_id", nullable = false) // Khóa ngoại tới ImageModel
    private ImageModel image;

    @ManyToOne
    @MapsId("colorId") // Ánh xạ colorId trong ProductsImagesId
    @JoinColumn(name = "color_id", nullable = false) // Khóa ngoại tới ColorModel
    private ColorModel color;

    // Thêm getter/setter nếu cần
    public ProductModel getProduct() {
        return product;
    }

    public void setProduct(ProductModel product) {
        this.product = product;
    }

    public ImageModel getImage() {
        return image;
    }

    public void setImage(ImageModel image) {
        this.image = image;
    }

    public ProductsImagesId getId() {
        return id;
    }

    public void setId(ProductsImagesId id) {
        this.id = id;
    }

    public ColorModel getColor() {
        return color;
    }

    public void setColor(ColorModel color) {
        this.color = color;
    }

    @Embeddable
    @Data
    public static class ProductsImagesId {

        @Column(name = "product_id", nullable = false)
        private int productId;

        @Column(name = "image_id", nullable = false)
        private int imageId;

        @Column(name = "color_id", nullable = false)
        private int colorId;

        // Constructors, getters, setters
        public int getProductId() {
            return productId;
        }

        public void setProductId(int productId) {
            this.productId = productId;
        }

        public int getImageId() {
            return imageId;
        }

        public void setImageId(int imageId) {
            this.imageId = imageId;
        }

        public int getColorId() {
            return colorId;
        }

        public void setColorId(int colorId) {
            this.colorId = colorId;
        }

        public ProductsImagesId(int productId, int imageId, int colorId) {
            this.productId = productId;
            this.imageId = imageId;
            this.colorId = colorId;
        }

        public ProductsImagesId() {
        }
    }
}