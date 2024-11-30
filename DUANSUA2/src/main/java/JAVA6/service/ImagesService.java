package JAVA6.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.ImageModel;
import JAVA6.Model.ProductsImagesModel;
import JAVA6.Model.ProductsImagesModel.ProductsImagesId;
import JAVA6.repository.ImageRepository;
import JAVA6.repository.ProductsImagesRepository;

@Service
public class ImagesService {

    @Autowired
    private ProductsImagesRepository productsImagesRepository;
    @Autowired
    private ImageRepository imageRepository;

    // Sửa phương thức để tìm hình ảnh theo ID
    public ImageModel getImageById(int productId, int imageId, int colorId) {
        // Tạo đối tượng ProductsImagesId để sử dụng làm khóa chính
        ProductsImagesId id = new ProductsImagesId(productId, imageId, colorId);

        // Tìm kiếm bằng ProductsImagesId
        return productsImagesRepository.findById(id)
                .map(productsImages -> productsImages.getImage()) // Trả về ImageModel nếu tìm thấy
                .orElse(null); // Trả về null nếu không tìm thấy
    }

    // Lấy danh sách hình ảnh theo productId
    public List<ImageModel> getImagesByProductId(Integer productId) {
        // Tìm tất cả các bản ghi trong ProductsImagesModel liên kết với productId
        List<ProductsImagesModel> productsImages = productsImagesRepository.findByProductId(productId);

        // Chuyển đổi từ ProductsImagesModel sang ImageModel
        return productsImages.stream()
                .map(ProductsImagesModel::getImage)
                .collect(Collectors.toList());
    }

    public List<ImageModel> getAllImages() {
        // TODO Auto-generated method stub
        return imageRepository.findAll();
    }
}