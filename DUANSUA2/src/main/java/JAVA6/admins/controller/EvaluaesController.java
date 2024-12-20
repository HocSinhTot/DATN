package JAVA6.admins.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.EvaluateModel;
import JAVA6.repository.EvaluaesRepository;
import JAVA6.service.EvaluaesService;

@RestController
@RequestMapping("/api/admin/evaluaes")
public class EvaluaesController {
    private static final Logger logger = LoggerFactory.getLogger(EvaluaesController.class);
    @Autowired
    private EvaluaesService evaluaesService;
    @Autowired
    private EvaluaesRepository evaluaesRepository;

    // API trả về danh sách đánh giá
    @GetMapping
    public List<EvaluateModel> listEvaluaes() {
        return evaluaesService.getAllEvaluate();
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<EvaluateModel> getEvaluesById(@PathVariable("id") int id) {
        logger.info("Fetching user with ID: {}", id);
        return evaluaesRepository.findById(id)
                .map(evaluaes -> {
                    logger.info("Found user: {}", evaluaes);
                    return ResponseEntity.ok(evaluaes);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<String> blockUser(@PathVariable("id") int id) {
        return evaluaesService.blockEvalues(id);
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable("id") int id) {
        return evaluaesService.unblockEvalues(id);
    }

}
