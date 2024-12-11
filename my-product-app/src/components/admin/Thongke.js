import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8080/api/orders/total")
            .then((response) => {
                console.log("Total Orders:", response.data);
                setTotalOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching total orders:", error);
            });
    }, []);


    return <h1 style={{ textAlign: 'center' }} > Total Orders: {totalOrders}</h1>;
};

export default Dashboard;
