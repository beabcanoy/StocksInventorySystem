<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

class PurchaseOrder{

    function addPurchaseOrder($json){
        include "connection.php";
        $decoded_json = json_decode($json, true);
        
        $supplier = $_POST["supplier"];
        $grandtotal = $_POST["grandtotal"];
        $discount_value = $_POST["discount_value"];
        $discount_percentage = $_POST["discount_percentage"];
        $tax_value = $_POST["tax_value"];
        $tax_percentage = $_POST["tax_percentage"];
        $poItemsTable = $decoded_json['poItemsTable'];
    
        try {
            $conn->beginTransaction();

        // Generate a unique po_code
        $prefix = "PO";
        $code = 1;

        //Incase dele mo sugot po_code na 4 digits
        // $prefix = "PO";
        // $timestamp = time(); // current timestamp
        // $po_code = sprintf("%s-%010d", $prefix, $timestamp);

        while (true) {
            $formattedCode = sprintf("%s-%04d", $prefix, $code);

            $checkCodeQuery = $conn->query("SELECT COUNT(*) AS count FROM `purchase_order_list` WHERE po_code = '$formattedCode'");
            $checkCodeResult = $checkCodeQuery->fetch(PDO::FETCH_ASSOC);
            $count = $checkCodeResult['count'];

            if ($count > 0) {
                $code++;
            } else {
                break;
            }
        }

        $po_code = $formattedCode;
        $orderStatus = 0;
    
            $sql ="INSERT INTO purchase_order_list(po_code, supplier_id, amount, discount, discount_percent, tax, tax_percent, status, date_created) ";
            $sql .= "VALUES (:po_code, :supplier, :grandtotal, :discount_value, :discount_percentage, :tax_value, :tax_percentage, :orderStatus, CURRENT_TIMESTAMP())";
    
            $stmtInsertOrder = $conn->prepare($sql);
            $stmtInsertOrder->bindParam(":po_code", $po_code);
            $stmtInsertOrder->bindParam(":supplier", $supplier);
            $stmtInsertOrder->bindParam(":grandtotal", $grandtotal);
            $stmtInsertOrder->bindParam(":discount_value", $discount_value);
            $stmtInsertOrder->bindParam(":discount_percentage", $discount_percentage);
            $stmtInsertOrder->bindParam(":tax_value", $tax_value);
            $stmtInsertOrder->bindParam(":tax_percentage", $tax_percentage);
            $stmtInsertOrder->bindParam(":orderStatus", $orderStatus);

            if ($stmtInsertOrder->execute()) {
                $poItemId = $conn->lastInsertId();

                $sqlItems = "INSERT INTO po_items(po_id, rawmat_id, quantity, price, unit, total) ";
                $sqlItems .= "VALUES(:po_id, :detail_rawmat, :detail_qty, :detail_price, :detail_unit, :detail_amount)";

                $stmtInsertItems = $conn->prepare($sqlItems);

                foreach ($poItemsTable as $poItemsTables) {
                    $stmtInsertItems->bindParam(":po_id", $poItemId);
                    $stmtInsertItems->bindParam(":detail_rawmat", $poItemsTables['detail_rawmat']);
                    $stmtInsertItems->bindParam(":detail_qty", $poItemsTables['detail_qty']);
                    $stmtInsertItems->bindParam(":detail_price", $poItemsTables['detail_price']);
                    $stmtInsertItems->bindParam(":detail_unit", $poItemsTables['detail_unit']);
                    $stmtInsertItems->bindParam(":detail_amount", $poItemsTables['detail_amount']);

            if (!$stmtInsertItems->execute()) {
                throw new Exception("Error executing SQL statement for po_items.");
            }
        }
            $conn->commit();
            return json_encode(array("status" => 1, "message" => "Purchase Order successfully saved."));
        } else {
            throw new Exception("Error executing SQL statement for purchase_order_list.");
        }

        } catch (PDOException $e) {
            $errorMsg = $e->getMessage();
            error_log("PDOException: " . $errorMsg);
            $conn->rollBack();
            return json_encode(array("status" => -1, "title" => "Database error.", "message" => $errorMsg));
        } catch (Exception $e) {
            $errorMsg = $e->getMessage();
            error_log("Exception: " . $errorMsg);
            $conn->rollBack();
            return json_encode(array("status" => -1, "title" => "An error occurred.", "message" => $errorMsg));
        } finally {
            $stmtInsertOrder = null;
            $stmtInsertItems = null;
            $conn = null;
        }
    }

    function getPurchaseOrder() {
        include "connection.php";

        $sql = "SELECT p.id, p.po_code, p.supplier_id, s.name AS supplier_name, ";
        $sql .= "p.status, p.date_created, ";
        $sql .= "COUNT(pi.rawmat_id) as items_count ";
        $sql .= "FROM purchase_order_list p ";
        $sql .= "LEFT JOIN po_items pi ON p.id = pi.po_id ";
        $sql .= "LEFT JOIN supplier_list s ON p.supplier_id = s.supplier_id ";
        $sql .= "GROUP BY p.id ORDER BY p.date_created DESC";


        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt = null;

        return json_encode($returnValue);
    }


    function getSupplier(){
        include "connection.php";

        $sql = "SELECT * FROM supplier_list WHERE status = 1 ORDER BY date_created DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt=null;

        return json_encode($returnValue);
    }

    function getRawMaterial(){
        include "connection.php";
    
        $sql = "SELECT * FROM rawmat_list WHERE status = 1 ORDER BY date_created DESC ";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt=null;
    
        return json_encode($returnValue);
    }

    function getPurchaseOrderDetails($poId){
        include "connection.php";
    
        try {
            $sql = "SELECT purchase_order_list.id, purchase_order_list.po_code, purchase_order_list.supplier_id, supplier_list.name AS supplier_name, ";
            $sql .= "purchase_order_list.amount, purchase_order_list.discount, purchase_order_list.discount_percent, purchase_order_list.tax, purchase_order_list.tax_percent, "; 
            $sql .= "purchase_order_list.status, purchase_order_list.date_created, po_items.rawmat_id, rawmat_list.name AS rawmat_name, ";
            $sql .=  "po_items.quantity, po_items.price, po_items.unit, po_items.total ";
            $sql .= "FROM purchase_order_list ";
            $sql .= "INNER JOIN po_items ON purchase_order_list.id = po_items.po_id ";
            $sql .= "INNER JOIN supplier_list ON purchase_order_list.supplier_id = supplier_list.supplier_id ";
            $sql .= "INNER JOIN rawmat_list ON po_items.rawmat_id = rawmat_list.rawmat_id ";
            $sql .= "WHERE purchase_order_list.id = :poId";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":poId", $poId);
            $stmt->execute();
    
            $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
           
            if (empty($records)) {
                return json_encode(['error' => 'No records found for the specified purchase order ID']);
            }
    
            
            $purchaseOrder = $records[0];
            $poItems = array_map(function($record) {
                return array(
                    'rawmat_id' => $record['rawmat_id'],
                    'rawmat_name' => $record['rawmat_name'],
                    'quantity' => $record['quantity'],
                    'price' => $record['price'],
                    'unit' => $record['unit'],
                    'total' => $record['total']
                );
            }, $records);
    
            
            $result = array(
                'purchaseOrder' => $purchaseOrder,
                'poItems' => $poItems
            );
    
            return json_encode($result);
        } catch (PDOException $e) {
            return json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    function savePurchaseOrder($json){
        include "connection.php";
        $received_purchase_order = $_POST["received_purchase_order"];
        $decoded_json = json_decode($json, true);
    
        $receivedPoItemsTable = $decoded_json['receivedPoItemsTable'];
    
        try {
            $conn->beginTransaction();
    
            // Insert data into stock_list
            $stockSql = "INSERT INTO stock_list (rawmat_id, quantity, unit, price, total, rawmat_netweight, date_registered) ";
            $stockSql .= "VALUES (:received_rawmat, :received_qty, :received_unit, :received_price, :received_amount, :rawmat_netweight, CURRENT_TIMESTAMP())";
    
            $stmtInsertStock = $conn->prepare($stockSql);
    
            foreach ($receivedPoItemsTable as $receivedPoItemsTables) {
                $stmtInsertStock->bindParam(":received_rawmat", $receivedPoItemsTables['received_rawmat']);
                $stmtInsertStock->bindParam(":received_qty", $receivedPoItemsTables['received_qty']);
                $stmtInsertStock->bindParam(":received_unit", $receivedPoItemsTables['received_unit']);
                $stmtInsertStock->bindParam(":received_price", $receivedPoItemsTables['received_price']);
                $stmtInsertStock->bindParam(":received_amount", $receivedPoItemsTables['received_amount']);
                $stmtInsertStock->bindParam(":rawmat_netweight", $receivedPoItemsTables['rawmat_netweight']);
    
                if (!$stmtInsertStock->execute()) {
                    throw new Exception("Error executing SQL statement for stock_list.");
                }
            }
    
            $updateStmt = $conn->prepare("UPDATE purchase_order_list SET status = 1 WHERE id = :received_purchase_order");
            $updateStmt->bindParam(":received_purchase_order", $received_purchase_order);
            
            if (!$updateStmt->execute()) {
                throw new Exception("Error executing SQL statement for updating purchase_order_list status.");
            }
    
            $conn->commit();
            return json_encode(array("status" => 1, "message" => "Purchase Order successfully saved."));
    
        } catch (PDOException $e) {
            $errorMsg = $e->getMessage();
            error_log("PDOException: " . $errorMsg);
            $conn->rollBack();
            return json_encode(array("status" => -1, "title" => "Database error.", "message" => $errorMsg));
        } catch (Exception $e) {
            $errorMsg = $e->getMessage();
            error_log("Exception: " . $errorMsg);
            $conn->rollBack();
            return json_encode(array("status" => -1, "title" => "An error occurred.", "message" => $errorMsg));
        } finally {
            $stmtInsertStock = null;
            $stmtUpdateStatus = null;
            $conn = null;
        }
    }
}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = isset($_POST["operation"]) ? $_POST["operation"] : "Invalid";
$poId = isset($_POST['poId']) ? $_POST['poId'] : null;

$purchase_order = new PurchaseOrder();

switch($operation){
    case "addPurchaseOrder":
        echo $purchase_order->addPurchaseOrder($json);
        break;
    case "getPurchaseOrder":
        echo $purchase_order->getPurchaseOrder();
        break;
        case "getPurchaseOrderDetails":
        echo $purchase_order->getPurchaseOrderDetails($poId);
        break;
    case "savePurchaseOrder":
        echo $purchase_order->savePurchaseOrder($json);
        break;
    case "getSupplier":
        echo $purchase_order->getSupplier();
        break;
    case "getRawMaterial":
        echo $purchase_order->getRawMaterial();
        break;
}

?>