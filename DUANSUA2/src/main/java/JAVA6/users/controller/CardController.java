package JAVA6.users.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CardController {
    @RequestMapping("/cart")
    public String like() {
    
        return "user/cart";
    }
}
