package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import JAVA6.Model.FavouriteModel;
import JAVA6.Model.UserModel;


public interface FavouritesRepository extends JpaRepository<FavouriteModel, Integer> {
	List<FavouriteModel> findByUser(UserModel user);
	
	@Query("SELECT CASE WHEN COUNT(o)> 0 THEN true ELSE false END FROM FavouriteModel o WHERE o.user.username=?1 AND o.product.id=?2")
	boolean existsByUsernameAndProductID(String username, int productId);
	
}