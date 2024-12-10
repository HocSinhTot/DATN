package JAVA6.admins.controller;

import JAVA6.Model.ProductsImagesModel;
import JAVA6.Model.ProductsPriceModel;
import JAVA6.Model.ProductsImagesModel.ProductsImagesId;
import JAVA6.Model.ProductsPriceModel.ProductsPriceId;
import JAVA6.service.ProductsImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products-images")
public class ProductsImagesController {

    @Autowired
    private ProductsImagesService productsImagesService;

    @GetMapping
    public ResponseEntity<List<ProductsImagesModel>> getAllProductsImage() {
        try {
            return ResponseEntity.ok(productsImagesService.getAllProductsImage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductsImagesModel>> getProductsImageByProductId(@PathVariable Integer productId) {
        try {
            List<ProductsImagesModel> result = productsImagesService.getProductsImageByProductId(productId);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping
    public ResponseEntity<ProductsImagesModel> createProductsImage(@RequestBody ProductsImagesModel productsImage) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(productsImagesService.createProductsImage(productsImage));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping
    public ResponseEntity<ProductsImagesModel> updateProductsPrice(@RequestBody ProductsImagesModel productsImage) {
        try {
            return ResponseEntity.ok(productsImagesService.updateProductsImage(productsImage.getId(), productsImage));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{productId}/{imageId}/{colorId}")
    public ResponseEntity<Void> deleteProductsImage(@PathVariable Integer productId,
                                                    @PathVariable Integer imageId,
                                                    @PathVariable Integer colorId) {
        try {
            ProductsImagesId id = new ProductsImagesId();
            id.setProductId(productId);
            id.setImageId(imageId);
            id.setColorId(colorId);
            productsImagesService.deleteProductsImage(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
