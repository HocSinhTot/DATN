package JAVA6.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.ColorModel;
import JAVA6.Model.EvaluateModel;
import JAVA6.Model.FavouriteModel;
import JAVA6.repository.ColorAdminRepository;

import JAVA6.repository.EvaluaesRepository;
import JAVA6.repository.FavouritesRepository;

@Service
public class EvaluaesService {
    @Autowired
    private EvaluaesRepository evaluaesRepository;

    public List<EvaluateModel> getAllEvaluate() {
        return evaluaesRepository.findAll();
    }

}