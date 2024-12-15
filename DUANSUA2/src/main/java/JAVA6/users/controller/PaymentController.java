package JAVA6.users.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import JAVA6.config.VnPayConfig;
import JAVA6.Model.PaymentRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @GetMapping("/vnpay")
    public ResponseEntity<Map<String, Object>> processVNPayPayment(
            @RequestParam(name = "amount", required = true) long amount,
            @RequestParam(name = "userId", required = true) int userId,
            @RequestParam(name = "address", required = true) String address,
            @RequestParam(name = "bankCode", required = false, defaultValue = "NCB") String bankCode,
            @RequestParam(name = "language", required = false, defaultValue = "vn") String language,
            HttpServletRequest request) {
        try {
            // Lấy địa chỉ IP của khách hàng
            String vnpIpAddr = VnPayConfig.getIpAddress(request);

            String vnp_TxnRef = VnPayConfig.getRandomNumber(8); // Mã giao dịch duy nhất
            String vnp_TmnCode = VnPayConfig.vnp_TmnCode; // Mã đối tác VNPay

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", VnPayConfig.vnp_Version);
            vnp_Params.put("vnp_Command", VnPayConfig.vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // Nhân với 100 để chuyển đổi sang tiền xu
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_IpAddr", vnpIpAddr);

            vnp_Params.put("vnp_Bill_Address", address);
            if (bankCode != null && !bankCode.isEmpty()) {
                vnp_Params.put("vnp_BankCode", bankCode);
            }

            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            String orderInfo = "Thanhtoandonhang" + vnp_TxnRef;
            String encodedOrderInfo = URLEncoder.encode(orderInfo, StandardCharsets.UTF_8);
            vnp_Params.put("vnp_OrderType", "110000"); // Ví dụ mã danh mục hàng hóa
            vnp_Params.put("vnp_ReturnUrl", "http://localhost:8080/api/cart/order/vnpayReturn?userId=" + userId);

            vnp_Params.put("vnp_OrderInfo", encodedOrderInfo);
            vnp_Params.put("vnp_Locale", language);

            // Tạo ngày giao dịch
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
           SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            // Đặt thời gian hết hạn
            cld.add(Calendar.MINUTE, 15); // Thời gian hết hạn 15 phút
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Sắp xếp các tham số và tính toán SecureHash
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && fieldValue.length() > 0) {
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                    if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            // Tính toán vnp_SecureHash
            String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
            String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;

            // In ra dữ liệu đã được chuẩn bị để gửi đi
            System.out.println("VNPAY Parameters:");
            for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
                System.out.println(entry.getKey() + ": " + entry.getValue());
            }
            System.out.println("Payment URL: " + paymentUrl);

            // Trả về URL thanh toán
            Map<String, Object> response = new HashMap<>();
            response.put("code", "00");
            response.put("message", "success");
            response.put("data", paymentUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", "99");
            errorResponse.put("message", "error");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}