package JAVA6.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import JAVA6.Model.CategoryModel;
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
}