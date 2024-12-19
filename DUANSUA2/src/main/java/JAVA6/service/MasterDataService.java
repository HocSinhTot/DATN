package JAVA6.service;


import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MasterDataService {

    private static final String TOKEN = "e31f71fd-bd3f-11ef-a349-824cd7dd2091"; // Token của bạn
    private static final String PROVINCE_API_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
    private static final String DISTRICT_API_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district";
    private static final String WARD_API_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward";

    private final RestTemplate restTemplate;

    public MasterDataService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getProvinces() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", TOKEN);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(PROVINCE_API_URL, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    public String getDistricts(int provinceId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", TOKEN);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{\"province_id\":" + provinceId + "}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(DISTRICT_API_URL, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    public String getWards(int districtId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", TOKEN);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{\"district_id\":" + districtId + "}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(WARD_API_URL, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }
}

