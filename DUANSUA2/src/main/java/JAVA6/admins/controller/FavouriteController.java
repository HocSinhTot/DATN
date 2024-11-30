package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.FavouriteModel;
import JAVA6.service.FavouriteService;

@RestController
@RequestMapping("/api/favourite")
public class FavouriteController {

    @Autowired
    private FavouriteService favouriteService;

    // Get the list of all favourites as JSON
    @GetMapping
    public List<FavouriteModel> getAllFavourites() {
        return favouriteService.getAllFavourite();
    }
}
