package JAVA6.Model;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@Entity
@Table(name = "DiscountCode")
public class DiscountCodeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "value", nullable = false)
    private BigDecimal value;

    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    private Date endDate;

    // Getter and Setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter and Setter for code
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // Getter and Setter for value
    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    // Getter and Setter for startDate
    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    // Getter and Setter for endDate
    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    // Phương thức này trả về tỷ lệ giảm giá dưới dạng phần trăm
    public BigDecimal getDiscountPercentage() {
        if (value != null && value.compareTo(BigDecimal.ZERO) > 0) { 
            // Kiểm tra giá trị không null và lớn hơn 0
            return value.divide(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO; // Nếu giá trị không hợp lệ, trả về 0
    }

    // Phương thức kiểm tra ngày hết hạn của mã giảm giá
    public boolean isValid() {
        LocalDate currentDate = LocalDate.now(); // Lấy ngày hiện tại
        LocalDate start = startDate.toLocalDate(); // Chuyển startDate sang LocalDate
        LocalDate end = endDate.toLocalDate(); // Chuyển endDate sang LocalDate

        // Kiểm tra xem ngày hiện tại có nằm trong khoảng startDate và endDate không
        return !currentDate.isBefore(start) && !currentDate.isAfter(end);
    }
}
