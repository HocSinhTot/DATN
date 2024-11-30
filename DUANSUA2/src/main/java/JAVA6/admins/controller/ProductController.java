package JAVA6.admins.controller;

import JAVA6.Model.ProductModel;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private ProductService productService;

    // Hiển thị danh sách sản phẩm
    // @GetMapping("/products")
    // public String showProducts(Model model) {
    //     model.addAttribute("products", productService.getAllProducts());
    //     return "admin/product"; // Tên view để hiển thị danh sách sản phẩm
    // }

    // // Hiển thị form thêm sản phẩm
    // @GetMapping("/products/add")
    // public String showCreateProductForm(Model model) {
    // model.addAttribute("categories", categoryService.getAllCate());
    // model.addAttribute("brands", brandService.getAllBrands());
    // model.addAttribute("product", new ProductModel()); // Thêm đối tượng
    // ProductModel vào model để điền dữ liệu vào
    // // form
    // return "admin/addProduct"; // Tên view của form thêm sản phẩm
    // }

    // // Xử lý thêm sản phẩm
    // @PostMapping("/products/add")
    // public String createProduct(@ModelAttribute("product") ProductModel product)
    // {
    // productService.saveProduct(product);
    // logger.info("Đã thêm sản phẩm mới: " + product.getName());
    // return "redirect:/products"; // Chuyển hướng về trang danh sách sản phẩm
    // }

    // // Xóa sản phẩm
    // @DeleteMapping("/products/{id}")
    // @ResponseBody
    // public String deleteProduct(@PathVariable("id") Integer id) {
    // try {
    // productService.deleteProduct(id);
    // logger.info("Đã xóa sản phẩm có ID: " + id);
    // return "Sản phẩm đã được xóa thành công!";
    // } catch (Exception e) {
    // logger.error("Lỗi khi xóa sản phẩm: ", e);
    // return "Không thể xóa sản phẩm.";
    // }
    // }
}
