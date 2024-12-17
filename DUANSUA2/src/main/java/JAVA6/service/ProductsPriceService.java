package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.ProductsPriceModel;

import JAVA6.repository.ProductsPriceRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsPriceService {

    @Autowired
    private ProductsPriceRepository productsPriceRepository;

    // Lấy tất cả ProductsPrice
    public List<ProductsPriceModel> getAllProductsPrices() {
        return productsPriceRepository.findAll();
    }

    // // Lấy ProductsPrice theo productId
    // public List<ProductsPriceModel> getProductsPricesByProductId(Integer productId) {
    //     return productsPriceRepository.findByIdProductId(productId);
    // }

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
    public ProductsPriceModel getPriceByProductAndCapacity(int productId, int capacityId) {
        Optional<ProductsPriceModel> productsPrice = productsPriceRepository.findByProduct_IdAndCapacity_Id(productId, capacityId);
        if (productsPrice.isEmpty()) {
            throw new RuntimeException("Không tìm thấy giá cho sản phẩm và dung lượng này: productId=" + productId + ", capacityId=" + capacityId);
        }
        return productsPrice.get();
    }
}
