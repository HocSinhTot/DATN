package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.ProductsPriceModel;

import JAVA6.repository.ProductsPriceRepository;

import java.util.List;

@Service
public class ProductsPriceService {

    @Autowired
    private ProductsPriceRepository productsPriceRepository;

    // Lấy tất cả ProductsPrice
    public List<ProductsPriceModel> getAllProductsPrices() {
        return productsPriceRepository.findAll();
    }

    // Lấy ProductsPrice theo productId
    public List<ProductsPriceModel> getProductsPricesByProductId(Integer productId) {
        return productsPriceRepository.findByIdProductId(productId);
    }

    // Tạo mới ProductsPrice
    public ProductsPriceModel createProductsPrice(ProductsPriceModel productsPrice) {
        return productsPriceRepository.save(productsPrice);
    }

    // // Cập nhật ProductsPrice
    // public ProductsPriceModel updateProductsPrice(ProductsPriceModel id, ProductsPriceModel updatedProductsPrice) {
    //     return productsPriceRepository.findById(id)
    //             .map(existing -> {
    //                 existing.setProduct(updatedProductsPrice.getProduct());
    //                 existing.setColor(updatedProductsPrice.getColor());
    //                 existing.setCapacity(updatedProductsPrice.getCapacity());
    //                 existing.setPrice(updatedProductsPrice.getPrice());
    //                 return productsPriceRepository.save(existing);
    //             }).orElseThrow(() -> new RuntimeException("ProductsPrice not found"));
    // }

    // Xóa ProductsPrice
    // public void deleteProductsPrice(ProductsPriceModel id) {
    //     productsPriceRepository.deleteById(id);
    // }
}
