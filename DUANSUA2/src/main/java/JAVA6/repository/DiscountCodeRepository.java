package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.DiscountCodeModel;

@Repository
public interface DiscountCodeRepository extends JpaRepository<DiscountCodeModel, Integer> {
    // Find a discount code by its code
    DiscountCodeModel findByCode(String code);

    // Fetch all discount codes
    List<DiscountCodeModel> findAll(); // Returns all discount codes
}
