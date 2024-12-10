package JAVA6.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.CapacityModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ProductModel;
import JAVA6.repository.CapacityAdminRepository;
import JAVA6.repository.ColorAdminRepository;

@Service
public class CapacityService {
    @Autowired
    private CapacityAdminRepository capacityAdminRepository;

    public List<CapacityModel> getAllCapacity() {
        return capacityAdminRepository.findAll();
    }

    public void saveColor(CapacityModel capacity) {
        capacityAdminRepository.save(capacity);
    }

    public CapacityModel getCapacityById(Integer id) {
        return capacityAdminRepository.findById(id).orElse(null);
    }

    public void deleteCapacity(Integer id) {
        capacityAdminRepository.deleteById(id);
    }
}