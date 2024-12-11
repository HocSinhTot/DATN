package JAVA6.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;

@Service
public class UsersService {

    @Autowired
    private UsersRepository nguoiDungRepository;

    public List<UserModel> getAllNguoiDung() {
        return nguoiDungRepository.findAll();
    }

    public long getTotalCustomers() {
        return nguoiDungRepository.count(); // Đếm tổng số bản ghi trong bảng Users
    }
}