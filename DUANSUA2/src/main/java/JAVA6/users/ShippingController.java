package JAVA6.users;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.service.ShippingService;

@RestController
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    // Tính phí giao hàng
    @GetMapping("/shipping/calculate-fee")
    public String calculateShippingFee( @RequestParam("to_district") int to_district_id,
    @RequestParam("to_ward") int to_ward_code) {
        return shippingService.calculateShippingFee( to_district_id,to_ward_code);  // Gọi service tính phí giao hàng
    }

    // Lấy danh sách dịch vụ có sẵn từ GHN
    @GetMapping("/shipping/available-services")
    public String getAvailableServices(
            @RequestParam("from_district") int fromDistrict,
            @RequestParam("to_district") int toDistrict) {
        // Gọi service để lấy danh sách dịch vụ có sẵn từ GHN
        return shippingService.getAvailableServices(fromDistrict, toDistrict);
    }
}
