package JAVA6.service;

import JAVA6.Model.BrandModel;
import JAVA6.Model.CapacityModel;
import JAVA6.repository.BrandRepository;
import JAVA6.repository.CapacityAdminRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CapacityService {
    @Autowired
    private CapacityAdminRepository capacityRepository;

    public List<CapacityModel> findAll() {
        return capacityRepository.findAll();
    }

    public Optional<CapacityModel> findById(int id) {
        return capacityRepository.findById(id);
    }

}