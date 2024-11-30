package JAVA6.users.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import JAVA6.Model.FavouriteModel;
import JAVA6.Model.ProductModel;
import JAVA6.repository.FavouritesRepository;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.UsersRepository;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private FavouritesRepository favouritesRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ProductRepository productRepository;

    // Thêm sản phẩm vào danh sách yêu thích
    @GetMapping("/add/{id}")
    public ResponseEntity<?> addLike(HttpSession session, @PathVariable("id") int id) {
        String username = (String) session.getAttribute("username");

        if (username == null) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        // Lấy sản phẩm từ cơ sở dữ liệu
        Optional<ProductModel> optionalProduct = productRepository.findById(id);

        if (!optionalProduct.isPresent()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        ProductModel product = optionalProduct.get();

        // Kiểm tra nếu sản phẩm đã có trong danh sách yêu thích của người dùng
        if (!favouritesRepository.existsByUsernameAndProductID(username, id)) {
            FavouriteModel like = new FavouriteModel();
            like.setUser(usersRepository.findByUsername(username).get(0)); // Lấy người dùng từ session
            like.setProduct(product); // Gán sản phẩm vào favourite
            favouritesRepository.saveAndFlush(like); // Lưu vào cơ sở dữ liệu
            return new ResponseEntity<>("Product added to favourites", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("Product is already in the wishlist", HttpStatus.BAD_REQUEST);
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    @DeleteMapping("/delete")
    public ResponseEntity<?> delLike(@RequestParam("id") int id) {
        if (!favouritesRepository.existsById(id)) {
            return new ResponseEntity<>("Favourite not found", HttpStatus.NOT_FOUND);
        }

        favouritesRepository.deleteById(id);
        return new ResponseEntity<>("Favourite deleted", HttpStatus.OK);
    }
}
