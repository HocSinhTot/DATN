package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.CapacityModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.ProductsPriceModel;
import JAVA6.repository.CapacityAdminRepository;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.ProductsPriceRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsPriceService {

    @Autowired
    private ProductsPriceRepository productsPriceRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CapacityAdminRepository capacityRepository;

    // Lấy tất cả ProductsPrice
    public List<ProductsPriceModel> getAllProductsPrices() {
        return productsPriceRepository.findAll();
    }

    // // Lấy ProductsPrice theo productId
    // public List<ProductsPriceModel> getProductsPricesByProductId(Integer
    // productId) {
    // return productsPriceRepository.findByIdProductId(productId);
    // }

    // // Cập nhật ProductsPrice
    // public ProductsPriceModel updateProductsPrice(ProductsPriceModel id,
    // ProductsPriceModel updatedProductsPrice) {
    // return productsPriceRepository.findById(id)
    // .map(existing -> {
    // existing.setProduct(updatedProductsPrice.getProduct());
    // existing.setColor(updatedProductsPrice.getColor());
    // existing.setCapacity(updatedProductsPrice.getCapacity());
    // existing.setPrice(updatedProductsPrice.getPrice());
    // return productsPriceRepository.save(existing);
    // }).orElseThrow(() -> new RuntimeException("ProductsPrice not found"));
    // }

    // Xóa ProductsPrice
    // public void deleteProductsPrice(ProductsPriceModel id) {
    // productsPriceRepository.deleteById(id);
    // }
    public ProductsPriceModel getPriceByProductAndCapacity(int productId, int capacityId) {
        Optional<ProductsPriceModel> productsPrice = productsPriceRepository.findByProduct_IdAndCapacity_Id(productId,
                capacityId);
        if (productsPrice.isEmpty()) {
            throw new RuntimeException("Không tìm thấy giá cho sản phẩm và dung lượng này: productId=" + productId
                    + ", capacityId=" + capacityId);
        }
        return productsPrice.get();
    }

    // Thêm giá sản phẩm mới
    public ProductsPriceModel createProductsPrice(ProductsPriceModel productsPrice) {
        return productsPriceRepository.save(productsPrice); // Trả về đối tượng sau khi lưu vào DB
    }

    // Cập nhật giá sản phẩm (theo productId và capacityId)
    public ProductsPriceModel updateProductsPrice(Integer productId, Integer capacityId,
            ProductsPriceModel productsPrice) {
        // Tìm kiếm sản phẩm và dung lượng trong DB
        ProductModel product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        CapacityModel capacity = capacityRepository.findById(capacityId)
                .orElseThrow(() -> new RuntimeException("Dung lượng không tồn tại"));

        // Cập nhật giá sản phẩm với các đối tượng tìm được
        productsPrice.setProduct(product); // Thiết lập đối tượng Product
        productsPrice.setCapacity(capacity); // Thiết lập đối tượng Capacity

        // Lưu sản phẩm giá đã cập nhật
        return productsPriceRepository.save(productsPrice); // Trả về đối tượng đã cập nhật
    }

    // Xóa giá sản phẩm
    public void deleteProductsPrice(Integer productId, Integer capacityId) {
        // Kiểm tra tồn tại và xóa
        if (productsPriceRepository.existsById(productId)) {
            productsPriceRepository.deleteById(productId);
        }
    }
}
