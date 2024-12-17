// <!DOCTYPE html>
// <html lang="en" xmlns:th="http://www.thymeleaf.org">

// <head th:replace="~{layout/head :: head}"></head>

// <body>
//   <!-- ============================================== HEADER ============================================== -->
//   <div th:replace="~{layout/header :: header}"></div>
//   <!-- ============================================== HEADER : END ============================================== -->

//   <div class="breadcrumb">
//     <div class="container">
//       <div class="breadcrumb-inner">
//         <h1>Danh sách mã giảm giá</h1>
//       </div>
//       <!-- /.breadcrumb-inner -->
//     </div>
//     <!-- /.container -->
//   </div>
//   <!-- /.breadcrumb -->

//   <div class="body-content outer-top-xs">
//     <div class="container">
//       <div class="row">
//         <ul>
//           <li th:each="discount : ${discountCodes}">
//             <span th:text="${discount.code}"></span>
//             <form th:action="@{/categories/discounts/claim}" method="post" style="display: inline;">
//               <input type="hidden" name="discountCodeId" th:value="${discount.id}" />
//               <button type="submit">Lấy mã</button>
//             </form>
//           </li>
//         </ul>
//       </div>
//     </div>
//   </div>
//   <!-- /.body-content -->

//   <!-- ============================================================= FOOTER ============================================================= -->
//   <div th:replace="~{layout/footer :: footer}"></div>
// </body>

// </html>