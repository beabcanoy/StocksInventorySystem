<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

class Stocks{
    function getStocks(){
        include "connection.php";
        
        $sql = "SELECT rawmat_list.name, SUM(stock_list.quantity) AS total_quantity, SUM(stock_list.rawmat_netweight) AS total_netweight ";
        $sql .= "FROM stock_list ";
        $sql .= "INNER JOIN rawmat_list ON stock_list.rawmat_id = rawmat_list.rawmat_id ";
        $sql .= "GROUP BY rawmat_list.name";
    
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        $stmt = null;
    
        return json_encode($returnValue);

    }
    
    function getRawmats()
    {
        include "connection.php";

        $sql = "SELECT rawmat_id, name FROM rawmat_list WHERE status = '1'";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        $stmt = null;

        return json_encode($returnValue);
    }
}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];

$stocks = new Stocks();

switch($operation){
    case "getStocks":
        echo $stocks->getStocks();
        break;
    case "getRawmats":
        echo $stocks->getRawmats();
        break;
}

?>