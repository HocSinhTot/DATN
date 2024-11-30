package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import JAVA6.Model.ColorModel;
import JAVA6.service.ColorService;

@RestController
@RequestMapping("/api/colors")
public class ColorController {

    @Autowired
    private ColorService colorService;

    // Get all colors
    @GetMapping
    public List<ColorModel> listColors() {
        return colorService.getAllColors();
    }

    // // Add a new color
    // @PostMapping("/add")
    // @ResponseStatus(HttpStatus.CREATED)
    // public ColorModel addColor(@RequestBody ColorModel color) {
    // colorService.saveColor(color);
    // return color; // Returning the created color object
    // }

    // // Edit color (update)
    // @PostMapping("/edit/{id}")
    // public ColorModel editColor(@PathVariable("id") Integer id, @RequestBody
    // ColorModel color) {
    // color.setId(id); // Ensure the id is updated
    // colorService.saveColor(color);
    // return color; // Returning the updated color object
    // }

    // // Delete color
    // @DeleteMapping("/delete/{id}")
    // @ResponseStatus(HttpStatus.NO_CONTENT)
    // public void deleteColor(@PathVariable("id") Integer id) {
    // colorService.deleteColor(id);
    // }
}
