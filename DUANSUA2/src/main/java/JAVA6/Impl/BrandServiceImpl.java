package JAVA6.Impl;

import JAVA6.Model.BrandModel;
import JAVA6.repository.BrandRepository;
import JAVA6.service.BrandService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public List<BrandModel> getAllBrands() {
        return brandRepository.findAll();
    }

    public BrandRepository getBrandRepository() {
        return brandRepository;
    }

    public void setBrandRepository(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }
}