package JAVA6;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Servlet implementation class cmm
 */
@Controller
public class cmm extends HttpServlet {
	
@RequestMapping("hello")
public String hello(Model model) {
	model.addAttribute("message","FPr<b>po;ly");
	return "ASM";
}
	
}
