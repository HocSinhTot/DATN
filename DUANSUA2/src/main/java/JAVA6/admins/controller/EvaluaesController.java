package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.EvaluateModel;
import JAVA6.service.EvaluaesService;

@RestController
@RequestMapping("/api/admin/evaluaes")
public class EvaluaesController {

    @Autowired
    private EvaluaesService evaluaesService;

    // API trả về danh sách đánh giá
    @GetMapping
    public List<EvaluateModel> listEvaluaes() {
        return evaluaesService.getAllEvaluate();
    }
}
