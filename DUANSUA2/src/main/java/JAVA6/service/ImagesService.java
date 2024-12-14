package JAVA6.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.CapacityModel;
import JAVA6.Model.ImageModel;

import JAVA6.repository.ImageRepository;
import JAVA6.repository.ProductdetailsRepository;

@Service
public class ImagesService {

    @Autowired
    private ProductdetailsRepository productsImagesRepository;
    @Autowired
    private ImageRepository imageRepository;

    public List<ImageModel> getAllImages() {
        // TODO Auto-generated method stub
        return imageRepository.findAll();
    }


    public void saveColor(ImageModel image) {
        imageRepository.save(image);
    }

    public ImageModel getImageById(Integer id) {
        return imageRepository.findById(id).orElse(null);
    }

    public void deleteImage(Integer id) {
        imageRepository.deleteById(id);
    }
}