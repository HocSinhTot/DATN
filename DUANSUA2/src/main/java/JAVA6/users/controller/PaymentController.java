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

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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
            @RequestParam(name = "bankCode", required = false, defaultValue = "NCB") String bankCode,
            @RequestParam(name = "language", required = false, defaultValue = "vn") String language,
            HttpServletRequest request) {
        try {
            String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
            String vnp_TmnCode = VnPayConfig.vnp_TmnCode;

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", VnPayConfig.vnp_Version);
            vnp_Params.put("vnp_Command", VnPayConfig.vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
            vnp_Params.put("vnp_CurrCode", "VND");

            if (bankCode != null && !bankCode.isEmpty()) {
                vnp_Params.put("vnp_BankCode", bankCode);
            }

            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toán đơn hàng: " + vnp_TxnRef);
            vnp_Params.put("vnp_Locale", language);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && fieldValue.length() > 0) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                         .append('=')
                         .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                    if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
            String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;

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
