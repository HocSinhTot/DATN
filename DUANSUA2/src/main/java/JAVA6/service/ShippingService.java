package JAVA6.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.json.JSONObject;

@Service
public class ShippingService {

    private static final String API_FEE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    private static final String API_SERVICE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";  // API lấy dịch vụ
    private static final String TOKEN = "e31f71fd-bd3f-11ef-a349-824cd7dd2091";  // Token API của bạn
    private static final int SHOP_ID = 195684;  // ID cá nhân của bạn

    // Cấu hình RestTemplate
    private final RestTemplate restTemplate;

    public ShippingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Phương thức lấy dịch vụ có sẵn từ GHN
    public String getAvailableServices(int fromDistrict, int toDistrict) {
        JSONObject requestBody = new JSONObject();
        requestBody.put("shop_id", SHOP_ID);  // ID cửa hàng
        requestBody.put("from_district", fromDistrict);  // Mã quận lấy hàng
        requestBody.put("to_district", toDistrict);    // Mã quận giao hàng

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("token", TOKEN);  // Thêm token vào header

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            // Gửi yêu cầu POST đến API GHN để lấy các dịch vụ có sẵn
            ResponseEntity<String> response = restTemplate.exchange(
                API_SERVICE_URL,
                HttpMethod.POST, entity, String.class
            );

            // Kiểm tra kết quả trả về
            return response.getBody();  // Trả về danh sách các dịch vụ có sẵn

        } catch (HttpClientErrorException e) {
            // In ra chi tiết lỗi phản hồi từ API
            String errorResponse = e.getResponseBodyAsString();
            System.out.println("Lỗi khi gọi API dịch vụ: " + errorResponse);
            return "Lỗi khi gọi API: " + errorResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi gọi API: " + e.getMessage();
        }
    }

    // Phương thức tính phí vận chuyển
    public String calculateShippingFee(int to_district_id, String to_ward_code,int service) {
        // Dữ liệu yêu cầu tính phí
        JSONObject requestBody = new JSONObject();

        // Các mã quận/phường thực tế (cập nhật từ danh sách mã của GHN)
        requestBody.put("from_district_id", 1573);  // Ví dụ: Mã quận nơi lấy hàng (Quận 1)
        requestBody.put("from_ward_code", "550202");  // Ví dụ: Mã phường nơi lấy hàng (Phường Bến Nghé, Quận 1)
        requestBody.put("to_district_id", to_district_id);    // Ví dụ: Mã quận nơi giao hàng (Quận 3)
        requestBody.put("to_ward_code", to_ward_code);    // Ví dụ: Mã phường nơi giao hàng (Phường 12, Quận 3)
        requestBody.put("service_id", service);        // Ví dụ: Dịch vụ chuyển phát nhanh GHN
        requestBody.put("weight", 200);              // Cân nặng (gram) - Ví dụ: 1500g (1.5kg)
        requestBody.put("length", 20);               // Chiều dài (cm) - Ví dụ: 30cm
        requestBody.put("width", 20);                // Chiều rộng (cm) - Ví dụ: 30cm
        requestBody.put("height", 50);               // Chiều cao (cm) - Ví dụ: 40cm
        requestBody.put("insurance_value", 10000);   // Giá trị bảo hiểm (VND) - Ví dụ: 50.000 VND
        requestBody.put("cod_failed_amount", 2000);  // Mức phí thu tiền khi giao thất bại (VND) - Ví dụ: 3.000 VND
        // Gửi yêu cầu POST đến API GHN tính phí vận chuyển
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Token", TOKEN);  // Thêm token vào header
        headers.set("ShopId", String.valueOf(SHOP_ID));  // Thêm ShopId vào header

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(API_FEE_URL, HttpMethod.POST, entity, String.class);
            return response.getBody();  // Trả về phản hồi của API (phí vận chuyển)
        } catch (HttpClientErrorException e) {
            // In ra chi tiết lỗi phản hồi từ API
            String errorResponse = e.getResponseBodyAsString();
            System.out.println("Lỗi khi gọi API tính phí: " + errorResponse);
            return "Lỗi khi gọi API: " + errorResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi gọi API: " + e.getMessage();
        }
    }
}
