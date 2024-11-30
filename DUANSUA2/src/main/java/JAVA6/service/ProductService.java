package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import JAVA6.Model.ProductModel;
import JAVA6.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Lấy sản phẩm theo các tiêu chí lọc với phân trang
    public Page<ProductModel> getProductsByFilters(Integer categoryId, Integer brandId, Boolean ascending,
    Integer minPrice, Integer maxPrice, String keyword, int page, int size) {
// Xử lý sắp xếp
Pageable pageable = Pageable.unpaged();

if (size != 0) {
    if (ascending != null) {
        pageable = ascending 
                ? PageRequest.of(page, size, Sort.by("price").ascending()) 
                : PageRequest.of(page, size, Sort.by("price").descending());
    } else {
        pageable = PageRequest.of(page, size);
    }
}

// Chuyển đổi minPrice và maxPrice thành BigDecimal
BigDecimal minPriceBigDecimal = (minPrice != null) ? new BigDecimal(minPrice) : null;
BigDecimal maxPriceBigDecimal = (maxPrice != null) ? new BigDecimal(maxPrice) : null;

// Truy vấn với các bộ lọc
return productRepository.findByFilters(categoryId, brandId, minPriceBigDecimal, maxPriceBigDecimal, keyword, pageable);
}
    public ProductModel getProductById(Integer key) {
        return productRepository.findById(key)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm với ID: " + key));
    }

    public Object getAllProducts() {
        // TODO Auto-generated method stub
        return productRepository.findAll();
    }
}