// package JAVA6.admins.controller;

// import JAVA6.Model.BrandModel;
// import JAVA6.service.BrandAdminService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api/brands")
// public class BrandController {

// @Autowired
// private BrandAdminService brandService;

// // Get all brands
// @GetMapping
// public List<BrandModel> getAllBrands() {
// return brandService.findAll(); // Returns a list of all brands
// }

// // Get a single brand by ID
// @GetMapping("/{id}")
// public ResponseEntity<BrandModel> getBrandById(@PathVariable int id) {
// Optional<BrandModel> brand = brandService.findById(id);
// return brand.map(ResponseEntity::ok) // If found, return the brand
// .orElseGet(() -> ResponseEntity.notFound().build()); // If not found, return
// 404
// }

// // Create a new brand
// @PostMapping
// public ResponseEntity<BrandModel> createBrand(@RequestBody BrandModel brand)
// {
// BrandModel savedBrand = brandService.save(brand); // Save the new brand
// return ResponseEntity.ok(savedBrand); // Return the created brand with status
// 200
// }

// // // Update an existing brand
// // @PutMapping("/{id}")
// // public ResponseEntity<BrandModel> updateBrand(@PathVariable int id,
// // @RequestBody BrandModel brand) {
// // if (!brandService.existsById(id)) {
// // return ResponseEntity.notFound().build(); // If the brand doesn't exist,
// // return 404
// // }
// // brand.setId(id); // Set the ID to ensure it is updated
// // BrandModel updatedBrand = brandService.save(brand); // Save the updated
// brand
// // return ResponseEntity.ok(updatedBrand); // Return the updated brand with
// // status 200
// // }

// // // Delete a brand
// // @DeleteMapping("/{id}")
// // public ResponseEntity<Void> deleteBrand(@PathVariable int id) {
// // if (!brandService.existsById(id)) {
// // return ResponseEntity.notFound().build(); // If the brand doesn't exist,
// // return 404
// // }
// // brandService.deleteById(id); // Delete the brand by ID
// // return ResponseEntity.noContent().build(); // Return status 204 (No
// Content)
// // }
// }
