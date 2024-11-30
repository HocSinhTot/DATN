package JAVA6.admins.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class SaleController {
	 @RequestMapping("/sale")
	    public String Sale() {
	     
	        return "admin/sale";
	    }
}
