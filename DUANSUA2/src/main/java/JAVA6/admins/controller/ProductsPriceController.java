package JAVA6.admins.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import JAVA6.Model.ProductsPriceModel;

import JAVA6.service.ProductsPriceService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products-price")
public class ProductsPriceController {

    @Autowired
    private ProductsPriceService productsPriceService;

    @GetMapping
    public ResponseEntity<List<ProductsPriceModel>> getAllProductsPrices() {
        try {
            return ResponseEntity.ok(productsPriceService.getAllProductsPrices());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductsPriceModel>> getProductsPricesByProductId(@PathVariable Integer productId) {
        try {
            List<ProductsPriceModel> result = productsPriceService.getProductsPricesByProductId(productId);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<ProductsPriceModel> createProductsPrice(@RequestBody ProductsPriceModel productsPrice) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(productsPriceService.createProductsPrice(productsPrice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // @PutMapping
    // public ResponseEntity<ProductsPriceModel> updateProductsPrice(@RequestBody ProductsPriceModel productsPrice) {
    //     try {
    //         return ResponseEntity.ok(productsPriceService.updateProductsPrice(productsPrice.getId(), productsPrice));
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }

    // @DeleteMapping("/{productId}/{capacityId}/{colorId}")
    // public ResponseEntity<Void> deleteProductsPrice(@PathVariable Integer productId,
    //                                                 @PathVariable Integer capacityId,
    //                                                 @PathVariable Integer colorId) {
    //     try {
    //         ProductsPriceId id = new ProductsPriceId();
    //         id.setProductId(productId);
    //         id.setCapacityId(capacityId);
    //         id.setColorId(colorId);
    //         productsPriceService.deleteProductsPrice(id);
    //         return ResponseEntity.noContent().build();
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    //     }
    // }
}
