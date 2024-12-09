package JAVA6.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.ProductModel;
import JAVA6.repository.ProductdetailsRepository;

@Service
public class ProductDetailsService {

    @Autowired
    private ProductdetailsRepository productDetailsRepository;

    // Method to find a single product by its ID
    public Optional<ProductModel> findProductById(Integer id) {
        return productDetailsRepository.findById(id);
    }

    // Method to get top 6 products ordered by price descending
    public List<ProductModel> get6SanPhamOrderByPriceDesc() {
        return productDetailsRepository.findAllByOrderByPriceDesc().stream().limit(6).toList();
    }

    public List<Map<String, Object>> getProductCapacitiesAndPrices(int productId) {
        return productDetailsRepository.findCapacitiesAndPricesByProductId(productId);
    }

    public List<ProductModel> getSimilarProducts(int productId) {
        ProductModel product = productDetailsRepository.findById(productId).orElse(null);
        if (product != null) {
            // Tìm các sản phẩm có cùng thương hiệu hoặc danh mục
            return productDetailsRepository.findByCategoryIdOrBrandId(product.getCategory().getId(), product.getBrand().getId());
        }
        return Collections.emptyList(); // Trả về danh sách rỗng nếu không tìm thấy sản phẩm
    }
}
