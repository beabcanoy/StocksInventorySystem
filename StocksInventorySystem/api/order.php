<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

class Order
{
function addOrder($json) {
    include "connection.php";

    $json = json_decode($json, true);

    $client_name = $_POST["client_name"];
    $rawmat_id = $_POST["rawmat_name"];
    $headerTable = $json['headerTable'];

    try {
            $conn->beginTransaction();

        // Generate a unique po_code
        $prefix = "Order";
        $code = 1;

        //Incase dele mo sugot po_code na 4 digits
        // $prefix = "PO";
        // $timestamp = time(); // current timestamp
        // $po_code = sprintf("%s-%010d", $prefix, $timestamp);

        while (true) {
            $formattedCode = sprintf("%s-%04d", $prefix, $code);

            $checkCodeQuery = $conn->query("SELECT COUNT(*) AS count FROM `order_list` WHERE order_code = '$formattedCode'");
            $checkCodeResult = $checkCodeQuery->fetch(PDO::FETCH_ASSOC);
            $count = $checkCodeResult['count'];

            if ($count > 0) {
                $code++;
            } else {
                break;
            }
        }
        $so_code = $formattedCode;
        $status = 1;

    $sql = "INSERT INTO order_list(order_code, client_name, rawmat_id, status, item_description, pieces, weight, date_created) ";
    $sql .= "VALUES(:so_code, :client_name, :rawmat_id, :status, :detail_item_description, :detail_item_pcs, :detail_item_weight,  CURRENT_TIMESTAMP())";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(":so_code", $so_code);
        $stmt->bindParam(":client_name", $client_name);
        $stmt->bindParam(":rawmat_id", $rawmat_id);
        $stmt->bindParam(":status", $status);

    foreach ($headerTable as $headerTables) {
        $stmt->bindParam(":detail_item_description", $headerTables['detail_item_description']);
                $stmt->bindParam(":detail_item_pcs", $headerTables['detail_item_pcs']);
                $stmt->bindParam(":detail_item_weight", $headerTables['detail_item_weight']);

        $stmt->execute();
    }

    $conn->commit();
            $returnValue = 1;
        } catch (PDOException $e) {
            $conn->rollBack();
            $errorMsg = $e->getMessage();
            error_log("PDOException: " . $errorMsg);
            $returnValue = 0;
        }
    
        $stmt = null;
        $conn = null;
    
        return $returnValue;
    }

function getRecords()
{
    include "connection.php";

    $sql = "SELECT order_list.order_id, order_list.order_code, order_list.client_name, rawmat_list.name, order_list.item_description, order_list.pieces, order_list.weight, order_list.status, order_list.date_created ";
    $sql .= "FROM order_list ";
    $sql .= "INNER JOIN rawmat_list ON order_list.rawmat_id = rawmat_list.rawmat_id ";
    $sql .= "ORDER BY order_list.date_created DESC ";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Close connection and statement
        $conn = null;
        $stmt = null;

        return json_encode($returnValue);
    } catch (PDOException $e) {
        // Handle the exception and print error details
        echo "Error: " . $e->getMessage();
    }
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

    function deductRoll($rawMaterialId, $totalNetWeight) {
        include "connection.php";
        
        $sql = "SELECT stock_id, rawmat_netweight FROM stock_list WHERE rawmat_id = :rawMaterialId AND rawmat_netweight > 0 ORDER BY date_registered ASC, stock_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":rawMaterialId", $rawMaterialId);
        $stmt->execute();
        
        $rolls = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $deductedWeight = 0;
        foreach ($rolls as $roll) {
            $rollNetWeight = $roll['rawmat_netweight'];
            if ($totalNetWeight >= $rollNetWeight) {
                // Deduct full roll
                $totalNetWeight -= $rollNetWeight;
                $deductedWeight += $rollNetWeight;
                $sqlUpdate = "UPDATE stock_list SET rawmat_netweight = 0 WHERE stock_id = :rollId";
            } else {
                // Deduct partial roll
                $sqlUpdate = "UPDATE stock_list SET rawmat_netweight = rawmat_netweight - :netWeightToDeduct WHERE stock_id = :rollId";
                $stmtUpdate = $conn->prepare($sqlUpdate);
                $stmtUpdate->bindParam(":rollId", $roll['stock_id']);
                $stmtUpdate->bindParam(":netWeightToDeduct", $totalNetWeight);
                $stmtUpdate->execute();
                $deductedWeight += $totalNetWeight;
                $totalNetWeight = 0; // No more weight to deduct
                break; // Exit loop as deduction is complete
            }
            
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bindParam(":rollId", $roll['stock_id']);
            $stmtUpdate->execute();
        }
        
        if ($deductedWeight > 0) {
            $response = array("status" => 1, "message" => "Deducted $deductedWeight out of $totalNetWeight requested successfully.");
        } else {
            $response = array("status" => 0, "message" => "Not enough rolls to satisfy the required net weight.");
        }
        
        return json_encode($response);
    }    

    function getOrderId($order_id) {
        include "connection.php";
    
        // Fetch order data using $order_id
        $sql = "SELECT order_code, client_name FROM order_list WHERE order_code = :order_id"; // Corrected parameter name
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":order_id", $order_id); // Corrected parameter name
        $stmt->execute();
        
        $orderData = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // Check if order data is retrieved
        if (!$orderData) {
            echo json_encode(["error" => "Order not found"]); // Return error response
            exit;
        }
    
        // Retrieve other order data
        $sql = "SELECT item_description, pieces, weight FROM order_list WHERE order_code = :order_id"; // Corrected parameter name
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":order_id", $order_id); // Corrected parameter name
        $stmt->execute();
        
        $otherOrderData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Combine order data
        $result = array(
            'orderData' => $orderData,
            'otherOrderData' => $otherOrderData
        );
    
        $conn = null;
        $stmt = null;
        
        echo json_encode($result);
        exit; // Exit to prevent any additional output
    }    
    
}

$order_id = isset($_POST['order_id']) ? $_POST['order_id'] : "";
$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];

$order = new Order();

switch ($operation) {
    case "addOrder":
        echo $order->addOrder($json);
        break;
    case "getRecords":
        echo $order->getRecords();
        break;
    case "getRawmats":
        echo $order->getRawmats();
        break;
    case "deductRoll":
        $rawMaterialId = $_POST['name'];
        $totalNetWeight = $_POST['totalNetWeight'];
        echo $order->deductRoll($rawMaterialId, $totalNetWeight);
        break;
    case "getOrderId":
        echo $order->getOrderId($order_id);
        break;
}
?>