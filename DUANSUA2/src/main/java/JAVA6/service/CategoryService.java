package JAVA6.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import JAVA6.Model.CategoryModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryModel> getAllCate() {
        return categoryRepository.findAll();
    }

    public List<CategoryModel> findAll() {
        return categoryRepository.findAll();
    }
    public CategoryModel getCategoryById(int categoryId) {
        Optional<CategoryModel> categoryOptional = categoryRepository.findById(categoryId);
        return categoryOptional.orElse(null); // Trả về UserModel nếu tồn tại, hoặc null nếu không
    }

    public Object findById(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    public CategoryModel saveCategory(CategoryModel category) {
        return categoryRepository.save(category);
    }
}