package JAVA6.users.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import JAVA6.repository.OrderStatusRepository;
import JAVA6.service.HistoryService;
import jakarta.servlet.http.HttpSession;

@Controller
public class HistoryController {
	 @Autowired
	    private HistoryService historyService;
	    
	    @Autowired
	    private OrderStatusRepository orderStatusRepository;


	    @RequestMapping("/history")
	    public String orderHistory(Model model,@RequestParam(value = "userId", required = false) Integer id, HttpSession session,
                RedirectAttributes redirectAttributes) {
	    	Integer userId = (Integer) session.getAttribute("userId");
	    	id = userId;
	        List<OrderModel> orders = historyService.getbyIdOrders(id);
	        model.addAttribute("orders", orders);
	        return "user/historyorder"; 
	    }
}