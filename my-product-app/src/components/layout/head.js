import { css } from "jquery";
import { Helmet } from "react-helmet";
export default function Head() {
    return (
        <>
        <Helmet>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

            <meta name="description" content="" />
            <meta name="author" content="" />
            <meta name="keywords" content="MediaCenter, Template, eCommerce" />
            <meta name="robots" content="all" />

            {/* Bootstrap Core CSS */}
            <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />

            {/* Customizable CSS */}
            
            <link rel="stylesheet" href="/assets/css/main.css" />
            <link rel="stylesheet" href="/assets/css/blue.css" />
            <link rel="stylesheet" href="/assets/css/owl.carousel.css" />
            <link rel="stylesheet" href="/assets/css/owl.transitions.css" />
            <link rel="stylesheet" href="/assets/css/animate.min.css" />
            <link rel="stylesheet" href="/assets/css/rateit.css" />
            <link rel="stylesheet" href="/assets/css/rateit.css" />
            <link rel="stylesheet" href="/assets/css/bootstrap-select.min.css" />
          {/* Icons/Glyphs */}
            <link rel="stylesheet" href="/assets/css/font-awesome.css" />

            {/* Fonts */}
            <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,400italic,600,600italic,700,700italic,800" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
            
            {/* Sửa lại phần style */}
            <style jsx="true">
                {`
                    .alert {
                        position: fixed;
                        top: 20px;
                        left: 90%;
                        transform: translateX(-50%);
                        background: linear-gradient(45deg, #4caf50, #8bc34a);
                        color: white;
                        padding: 8px 25px;
                        width: 500px;
                        border-radius: 8px;
                        font-size: 12px;
                        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
                        z-index: 1000;
                        opacity: 0;
                        transform: translateY(-50px);
                        transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .alert.show {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }

                    .containers {
                        position: absolute;
                        top: 50%;
                        left: 1%;
                        border-radius: 50%;
                        height: 30px;
                        width: 30px;
                        animation: rotate_3922 1.2s linear infinite;
                        background-color: #9b59b6;
                        background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
                    }

                    .containers span {
                        position: absolute;
                        border-radius: 50%;
                        height: 100%;
                        width: 100%;
                        background-color: #9b59b6;
                        background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
                    }

                    .containers span:nth-of-type(1) {
                        filter: blur(5px);
                    }

                    .containers span:nth-of-type(2) {
                        filter: blur(10px);
                    }

                    .containers span:nth-of-type(3) {
                        filter: blur(25px);
                    }

                    .containers span:nth-of-type(4) {
                        filter: blur(50px);
                    }

                    .containers::after {
                        content: "";
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                        background-color: #fff;
                        border: solid 5px #ffffff;
                        border-radius: 50%;
                    }

                    @keyframes rotate_3922 {
                        from {
                            transform: translate(-50%, -50%) rotate(0deg);
                        }

                        to {
                            transform: translate(-50%, -50%) rotate(360deg);
                        }
                    }

                    .alert .close-btn {
                        background: none;
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        margin-left: 15px;
                    }


       



        /* Thông báo */
        .alert {
            position: fixed;
            top: 20px;
            left: 90%;
            transform: translateX(-50%);

            background: linear-gradient(45deg, #4caf50, #8bc34a);
            color: white;
            padding: 8px 25px;
            width: 500px;
            /* Chiều rộng cố định */
            border-radius: 8px;
            font-size: 12px;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-50px);
            transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Hiển thị thông báo */
        .alert.show {
            opacity: 1;
            transform: translate(-50%, 0);
        }

        /* From Uiverse.io by terenceodonoghue */
        .containers {
            position: absolute;
            top: 50%;
            left: 1%;
            border-radius: 50%;
            height: 30px;
            width: 30px;
            animation: rotate_3922 1.2s linear infinite;
            background-color: #9b59b6;
            background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
        }

        .containers span {
            position: absolute;
            border-radius: 50%;
            height: 100%;
            width: 100%;
            background-color: #9b59b6;
            background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
        }

        .containers span:nth-of-type(1) {
            filter: blur(5px);
        }

        .containers span:nth-of-type(2) {
            filter: blur(10px);
        }

        .containers span:nth-of-type(3) {
            filter: blur(25px);
        }

        .containers span:nth-of-type(4) {
            filter: blur(50px);
        }

        .containers::after {
            content: "";
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background-color: #fff;
            border: solid 5px #ffffff;
            border-radius: 50%;
        }

        @keyframes rotate_3922 {
            from {
                transform: translate(-50%, -50%) rotate(0deg);
            }

            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }


        /* Nút đóng thông báo */
        .alert .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            margin-left: 15px;
        }

                `}
            </style>
            </Helmet>
        </>
    );
}