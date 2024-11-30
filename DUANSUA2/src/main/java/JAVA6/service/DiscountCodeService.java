package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.DiscountCodeModel;
import JAVA6.repository.DiscountCodeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountCodeService {

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    public List<DiscountCodeModel> getAllDiscountCodes() {
        return discountCodeRepository.findAll();
    }

    public DiscountCodeModel getDiscountCodeById(Integer id) {
        Optional<DiscountCodeModel> discountCode = discountCodeRepository.findById(id);
        return discountCode.orElse(null);
    }

    public DiscountCodeModel createOrUpdateDiscountCode(DiscountCodeModel discountCode) {
        return discountCodeRepository.save(discountCode);
    }

    public void deleteDiscountCode(Integer id) {
        discountCodeRepository.deleteById(id);
    }
}
