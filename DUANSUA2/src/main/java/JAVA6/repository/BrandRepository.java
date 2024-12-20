package JAVA6.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import JAVA6.Model.BrandModel;

public interface BrandRepository extends JpaRepository<BrandModel, Integer> {
    BrandModel findBrandModelByName(String name);
    Page<BrandModel> findByNameContaining(String name, Pageable pageable);
}
