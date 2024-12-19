package JAVA6.users.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.service.MasterDataService;
import JAVA6.service.ShippingService;
@CrossOrigin(origins = "http://localhost:3000")  // Cho phép yêu cầu từ localhost:3000
@RestController
public class ShippingController {

    private final ShippingService shippingService;
    private final MasterDataService masterDataService;

    public ShippingController(ShippingService shippingService,MasterDataService masterDataService) {
        this.shippingService = shippingService;
        this.masterDataService = masterDataService;
    }


    // Lấy danh sách tỉnh thành
    @GetMapping("/api/provinces")
    public String getProvinces() {
        return masterDataService.getProvinces();
    }

    // Lấy danh sách quận
    @GetMapping("/api/districts")
    public String getDistricts(@RequestParam("provinceId") int provinceId) {
        return masterDataService.getDistricts(provinceId);
    }

    // Lấy danh sách phường
    @GetMapping("/api/wards")
    public String getWards(@RequestParam("districtId") int districtId) {
        return masterDataService.getWards(districtId);
    }
    // Tính phí giao hàng
    @GetMapping("/shipping/calculate-fee")
    public String calculateShippingFee( @RequestParam("to_district") int to_district_id,
    @RequestParam("to_ward") String to_ward_code,@RequestParam("service_id") int service) {
        return shippingService.calculateShippingFee( to_district_id,to_ward_code,service);  // Gọi service tính phí giao hàng
    }

    // Lấy danh sách dịch vụ có sẵn từ GHN
    @GetMapping("/shipping/available-services")
    public String getAvailableServices(
           
            @RequestParam("to_district") int toDistrict) {
            int fromDistrict = 1573;
        // Gọi service để lấy danh sách dịch vụ có sẵn từ GHN
        return shippingService.getAvailableServices(fromDistrict, toDistrict);
    }
}
