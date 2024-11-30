package JAVA6.users.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class IntroduceControoller {
    @RequestMapping("/introduce")
    public String gts() {
    
        return "/user/introduce";
    }
}
