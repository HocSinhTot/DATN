package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import JAVA6.Model.EvaluateModel;
import JAVA6.Model.FavouriteModel;
import JAVA6.Model.UserModel;

public interface EvaluaesRepository extends JpaRepository<EvaluateModel, Integer> {

}