package JAVA6.Impl;

import JAVA6.Model.CategoryModel;
import JAVA6.repository.CategoryRepository;
import JAVA6.service.CategoryService;
import JAVA6.service.Categoryadmin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryServiceImpl implements Categoryadmin {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryModel> getAllCategories() {
        return categoryRepository.findAll();
    }
}
