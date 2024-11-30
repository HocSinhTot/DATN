package JAVA6.service;
import org.springframework.stereotype.Service;

import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.PaymentRequest;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentMethodService {
    
    private static final Map<Integer, String> paymentMethods = new HashMap<>();
    
    static {
        paymentMethods.put(1, "Cash on Delivery");
        paymentMethods.put(2, "VNPay");
        // Add more payment methods if needed
    }
    
    public static String getPaymentMethodById(int id) {
        return paymentMethods.get(id);
    }

    public OrderDetailModel processPayment(PaymentRequest paymentRequest) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'processPayment'");
    }
}
