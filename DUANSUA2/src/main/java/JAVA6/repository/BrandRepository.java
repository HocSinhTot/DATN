package JAVA6.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import JAVA6.Model.BrandModel;

public interface BrandRepository extends JpaRepository<BrandModel, Integer> {
    BrandModel findBrandModelByName(String name);
}
