package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
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
}