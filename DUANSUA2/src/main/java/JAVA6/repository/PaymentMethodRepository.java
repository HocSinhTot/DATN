package JAVA6.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import JAVA6.Model.PaymentMethodModel;


public interface PaymentMethodRepository extends JpaRepository<PaymentMethodModel, Integer> {
	PaymentMethodModel findByMethods(String methods);
}


