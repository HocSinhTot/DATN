package JAVA6.repository;

import org.springframework.stereotype.Repository;

import JAVA6.Model.ColorModel;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ColorAdminRepository extends JpaRepository<ColorModel, Integer> {

}