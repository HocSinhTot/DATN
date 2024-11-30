package JAVA6.admins.controller;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/check-login")
public class CheckLoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Kiểm tra xem có thông tin người dùng đã được lưu trong session hay không
        String username = (String) request.getSession().getAttribute("username");
        if (username != null && !username.isEmpty()) {
            // Người dùng đã đăng nhập, trả về trạng thái "authenticated"
            response.getWriter().write("authenticated");
        } else {
            // Người dùng chưa đăng nhập, trả về trạng thái "unauthenticated"
            response.getWriter().write("unauthenticated");
        }
    }
}
