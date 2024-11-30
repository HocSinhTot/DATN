package JAVA6.admins.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import JAVA6.Model.DiscountCodeModel;
import JAVA6.service.DiscountCodeService;

@Controller
public class DiscountCodeController {

    @Autowired
    private DiscountCodeService discountCodeService;

    // Show the list of discount codes
    @GetMapping("/discount-codes")
    public String showDiscountCodes(Model model) {
        model.addAttribute("discountCodes", discountCodeService.getAllDiscountCodes());
        return "admin/discount-codes"; // View for displaying all discount codes
    }

    // Show the form to add a new discount code
    @GetMapping("/discount-codes/add")
    public String showAddDiscountCodeForm(Model model) {
        model.addAttribute("discountCode", new DiscountCodeModel());
        return "admin/form"; // Return the form for adding a new discount code
    }

    // Show the form to edit an existing discount code
    @GetMapping("/discount-codes/edit/{id}")
    public String showEditDiscountCodeForm(@PathVariable("id") Integer id, Model model) {
        DiscountCodeModel discountCode = discountCodeService.getDiscountCodeById(id);
        if (discountCode != null) {
            model.addAttribute("discountCode", discountCode);
            return "admin/form"; // Return the same form for editing the discount code
        }
        return "redirect:/discount-codes"; // Redirect to the discount codes list if not found
    }

    // Save or update the discount code
    @PostMapping("/discount-codes/save")
    public String saveDiscountCode(@ModelAttribute DiscountCodeModel discountCode) {
        discountCodeService.createOrUpdateDiscountCode(discountCode); // Save or update the discount code
        return "redirect:/discount-codes"; // Redirect to the list of discount codes after saving
    }

    // Delete the discount code
    @GetMapping("/discount-codes/delete/{id}")
    public String deleteDiscountCode(@PathVariable("id") Integer id) {
        discountCodeService.deleteDiscountCode(id); // Delete the discount code
        return "redirect:/discount-codes"; // Redirect to the discount codes list after deletion
    }
}
