package JAVA6.admins.controller;

import JAVA6.Model.CapacityModel;
import JAVA6.service.CapacityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/admin/capacity")
public class CapacityController {

    @Autowired
    private CapacityService capacityService;

    // Get all capacities
    @GetMapping
    public List<CapacityModel> listCapacity() {
        return capacityService.findAll();
    }

    // Add a new capacity
    // @PostMapping("/create")
    // @ResponseStatus(HttpStatus.CREATED)
    // public CapacityModel createCapacity(@RequestBody CapacityModel capacity) {
    // capacityService.saveCapacity(capacity);
    // return capacity; // Returning the created capacity object
    // }
}
