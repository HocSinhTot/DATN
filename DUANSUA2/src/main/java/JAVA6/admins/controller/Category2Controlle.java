// package JAVA6.admins.controller;

// import JAVA6.Model.CategoryModel;
// import JAVA6.service.CategoryService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/categories") // Đổi tên endpoint thành API endpoint
// public class Category2Controlle {

// @Autowired
// private CategoryService categoryService;

// // Lấy tất cả các danh mục
// @GetMapping
// public List<CategoryModel> listCategories() {
// return categoryService.findAll(); // Trả về danh sách các danh mục dưới dạng
// JSON
// }

// // // Tạo mới danh mục
// // @PostMapping
// // public CategoryModel saveCategory(@RequestBody CategoryModel category) {
// // return categoryService.save(category); // Lưu danh mục và trả về danh mục
// đã
// // lưu
// // }

// // // Cập nhật danh mục
// // @PutMapping("/{id}")
// // public CategoryModel updateCategory(@PathVariable int id, @RequestBody
// // CategoryModel category) {
// // category.setId(id);
// // return categoryService.save(category); // Cập nhật danh mục và trả về danh
// // mục đã cập nhật
// // }

// // // Xóa danh mục
// // @DeleteMapping("/{id}")
// // public String deleteCategory(@PathVariable int id) {
// // categoryService.deleteById(id);
// // return "Category with ID " + id + " has been deleted successfully"; // Trả
// về
// // thông báo xóa thành công
// // }
// }
