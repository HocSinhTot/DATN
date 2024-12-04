package JAVA6.users.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import JAVA6.Model.FavouriteModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.FavouritesRepository;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.UsersRepository;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private FavouritesRepository favouritesRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ProductRepository productRepository;

    // Lấy danh sách yêu thích của người dùng
    @GetMapping("/like-products")
    public ResponseEntity<?> getLikedProducts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        String username = authHeader.substring(7);  // Lấy username từ token hoặc trực tiếp từ header nếu không dùng JWT

        Optional<UserModel> userOptional = usersRepository.findByUsername(username).stream().findFirst();
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UserModel user = userOptional.get();
        List<FavouriteModel> likes = favouritesRepository.findByUser(user);
        return ResponseEntity.ok(likes);
    }

    // Thêm sản phẩm vào danh sách yêu thích
    @PostMapping("/add")
    public ResponseEntity<?> addLike(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                     @RequestParam("productId") int productId) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        String username = authHeader.substring(7);

        Optional<ProductModel> optionalProduct = productRepository.findById(productId);
        if (!optionalProduct.isPresent()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        ProductModel product = optionalProduct.get();

        if (!favouritesRepository.existsByUsernameAndProductID(username, productId)) {
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
    public ResponseEntity<?> delLike(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                     @RequestParam("id") int id) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        if (!favouritesRepository.existsById(id)) {
            return new ResponseEntity<>("Favourite not found", HttpStatus.NOT_FOUND);
        }

        favouritesRepository.deleteById(id);
        return new ResponseEntity<>("Favourite deleted", HttpStatus.OK);
    }
}
