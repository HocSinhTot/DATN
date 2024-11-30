package JAVA6.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.ColorModel;
import JAVA6.repository.ColorAdminRepository;

@Service
public class ColorService {
    @Autowired
    private ColorAdminRepository colorRepository;

    public List<ColorModel> getAllColors() {
        return colorRepository.findAll();
    }

    public void saveColor(ColorModel color) {
        colorRepository.save(color);
    }

    public ColorModel getColorById(Integer id) {
        return colorRepository.findById(id).orElse(null);
    }

    public void deleteColor(Integer id) {
        colorRepository.deleteById(id);
    }
}