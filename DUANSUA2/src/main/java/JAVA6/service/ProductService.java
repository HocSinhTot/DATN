package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import JAVA6.Model.ProductModel;
import JAVA6.Model.ProductsImagesModel;
import JAVA6.Model.ProductsPriceModel;
import JAVA6.Model.ProductsPriceModel.ProductsPriceId;
import JAVA6.Model.ProductsImagesModel.ProductsImagesId;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.ProductsImagesRepository;
import JAVA6.repository.ProductsPriceRepository;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductsPriceRepository productsPriceRepository;
    private final ProductsImagesRepository productsImagesRepository;

    // Lấy sản phẩm theo các tiêu chí lọc với phân trang
    public Page<ProductModel> getProductsByFilters(
            Integer categoryId, Integer brandId, Boolean ascending, Integer minPrice,
            Integer maxPrice, String keyword, int page, int size) {

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

    // Lấy sản phẩm theo ID
    public ProductModel getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm với ID: " + id));
    }

    // Thêm chi tiết sản phẩm
    public ProductsPriceModel addProductDetails(Integer productId, Integer colorId, Integer capacityId, BigDecimal price) {
        ProductModel product = getProductById(productId);

        ProductsPriceId productsPriceId = new ProductsPriceId();
        productsPriceId.setProductId(productId);
        productsPriceId.setColorId(colorId);
        productsPriceId.setCapacityId(capacityId);

        ProductsPriceModel productPrice = new ProductsPriceModel();
        productPrice.setId(productsPriceId);
        productPrice.setProduct(product);
        productPrice.setPrice(price);

        return productsPriceRepository.save(productPrice);
    }

    // Thêm hình ảnh cho sản phẩm
    public ProductsImagesModel addProductImage(Integer productId, Integer imageId, Integer colorId) {
        ProductModel product = getProductById(productId);

        ProductsImagesId productsImagesId = new ProductsImagesId();
        productsImagesId.setProductId(productId);
        productsImagesId.setImageId(imageId);
        productsImagesId.setColorId(colorId);

        ProductsImagesModel productImage = new ProductsImagesModel();
        productImage.setId(productsImagesId);
        productImage.setProduct(product);

        return productsImagesRepository.save(productImage);
    }

    // Lấy tất cả sản phẩm
    public Page<ProductModel> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }
}
