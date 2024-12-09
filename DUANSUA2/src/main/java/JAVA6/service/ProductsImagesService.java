package JAVA6.service;

import JAVA6.Model.ProductsImagesModel;
import JAVA6.Model.ProductsImagesModel.ProductsImagesId;
import JAVA6.Model.ProductsPriceModel;
import JAVA6.Model.ProductsPriceModel.ProductsPriceId;
import JAVA6.repository.ProductsImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsImagesService {

    @Autowired
    private ProductsImagesRepository productsImagesRepository;

    
    // Lấy tất cả ProductsPrice
    public List<ProductsImagesModel> getAllProductsImage() {
        return productsImagesRepository.findAll();
    }

    // Lấy ProductsPrice theo productId
    public List<ProductsImagesModel> getProductsImageByProductId(Integer productId) {
        return productsImagesRepository.findByProductId(productId);
    }

    // Tạo mới ProductsPrice
    public ProductsImagesModel createProductsImage(ProductsImagesModel productsImage) {
        return productsImagesRepository.save(productsImage);
    }

    // Cập nhật ProductsPrice
    public ProductsImagesModel updateProductsImage(ProductsImagesId id, ProductsImagesModel updatedProductsImage) {
        return productsImagesRepository.findById(id)
                .map(existing -> {
                    existing.setProduct(updatedProductsImage.getProduct());
                    existing.setColor(updatedProductsImage.getColor());
                    existing.setImage(updatedProductsImage.getImage());
                    return productsImagesRepository.save(existing);
                }).orElseThrow(() -> new RuntimeException("ProductsPrice not found"));
    }

    // Xóa ProductsPrice
    public void deleteProductsImage(ProductsImagesId id) {
        productsImagesRepository.deleteById(id);
    }
}
