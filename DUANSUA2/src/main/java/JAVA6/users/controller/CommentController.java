package JAVA6.users.controller;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;

import JAVA6.service.PerspectiveApiService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private PerspectiveApiService perspectiveApiService;

    @PostMapping("/analyze")
    public Object analyzeComment(@RequestBody Map<String, String> request) {
        String comment = request.get("comment");
        return perspectiveApiService.analyzeComment(comment);
    }
    public String analyzeToxicity(JsonNode response) {
    double toxicityScore = response.get("attributeScores")
                                   .get("TOXICITY")
                                   .get("summaryScore")
                                   .get("value")
                                   .asDouble();

    if (toxicityScore < 0.25) {
        return "Bình luận không độc hại.";
    } else if (toxicityScore < 0.50) {
        return "Bình luận có thể độc hại.";
    } else {
        return "Bình luận rất độc hại!";
    }
}
@RequestMapping(value = "/analyze-image", method = RequestMethod.POST)
public ResponseEntity<?> analyzeImage(@RequestParam String image) {
    try {
        // Chuyển đổi hình ảnh thành Base64
        byte[] imageBytes = Base64.getDecoder().decode(image.split(",")[1]); // Lọc phần dữ liệu Base64 sau dấu ","

        // Tạo payload để gửi đến Google Vision API
        String visionApiUrl = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyD2jgYpTTXphJPv1fd_4MpacTPOJUhbVtk";
        Map<String, Object> payload = new HashMap<>();
        List<Map<String, Object>> requests = new ArrayList<>();
        
        Map<String, Object> request = new HashMap<>();
        request.put("image", Map.of("content", Base64.getEncoder().encodeToString(imageBytes)));  // Sửa lại đây
        request.put("features", List.of(Map.of("type", "TEXT_DETECTION")));
        requests.add(request);
        payload.put("requests", requests);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        // Gửi yêu cầu đến Vision API
        ResponseEntity<Map> response = restTemplate.exchange(visionApiUrl, HttpMethod.POST, entity, Map.class);

        // Trả về kết quả phân tích hình ảnh
        return ResponseEntity.ok(response.getBody());
    } catch (Exception e) {
        // In ra chi tiết lỗi
        logger.error("Error analyzing image: ", e);
        return new ResponseEntity<>("Error analyzing image", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

 
}
