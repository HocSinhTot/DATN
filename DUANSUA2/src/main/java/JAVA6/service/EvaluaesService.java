package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import JAVA6.Model.EvaluateModel;
import JAVA6.repository.EvaluaesRepository;

import java.util.List;

@Service
public class EvaluaesService {

    @Autowired
    private EvaluaesRepository evaluaesRepository;

    public List<EvaluateModel> getAllEvaluate() {
        return evaluaesRepository.findAll();
    }

    public void saveEvaluation(EvaluateModel evaluateModel) {
        // Lưu trực tiếp đối tượng evaluateModel mà không cần tạo mới
        evaluaesRepository.save(evaluateModel);
    }

    public List<EvaluateModel> getEvaluationsByProductId(int productId) {
        return evaluaesRepository.findByProduct_Id(productId);
    }

    public ResponseEntity<String> blockEvalues(int id) {
        return evaluaesRepository.findById(id)
                .map(evaluaes -> {
                    evaluaes.setActive(false); // Đặt trạng thái blocked
                    evaluaesRepository.save(evaluaes);
                    return ResponseEntity.ok("User blocked successfully.");
                })
                .orElse(ResponseEntity.status(404).body("User not found."));
    }

    public ResponseEntity<String> unblockEvalues(int id) {
        return evaluaesRepository.findById(id)
                .map(evaluaes -> {
                    evaluaes.setActive(true); // Đặt trạng thái active
                    evaluaesRepository.save(evaluaes);
                    return ResponseEntity.ok("User unblocked successfully.");
                })
                .orElse(ResponseEntity.status(404).body("User not found."));
    }

}