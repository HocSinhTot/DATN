package JAVA6.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PerspectiveApiService {

    private final String API_URL = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
    private final String API_KEY = "AIzaSyD2jgYpTTXphJPv1fd_4MpacTPOJUhbVtk";

    public JsonNode analyzeComment(String comment) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, String> commentData = new HashMap<>();
            commentData.put("text", comment);
            requestBody.put("comment", commentData);
            requestBody.put("languages", new String[]{"en"}); // Ngôn ngữ
            requestBody.put("requestedAttributes", Map.of("TOXICITY", new HashMap<>()));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String urlWithKey = API_URL + "?key=" + API_KEY;
            ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, request, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
