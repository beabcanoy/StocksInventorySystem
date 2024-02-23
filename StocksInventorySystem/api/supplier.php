<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Supplier{
    function addSupplier($json){
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
        $supplier_name = $decoded_json["supplier_name"];
        $supplier_address = $decoded_json["supplier_address"];
        $contact_person = $decoded_json["contact_person"];
        $contact_number = $decoded_json["contact_number"];
        $status = $decoded_json["status"];
    
        // Check if supplier with same name or contact number already exists
        $sqlCheckDuplicate = "SELECT * FROM supplier_list WHERE name = :supplier_name OR contact = :contact_number";
        $stmtCheckDuplicate = $conn->prepare($sqlCheckDuplicate);
        $stmtCheckDuplicate->bindParam(":supplier_name", $supplier_name);
        $stmtCheckDuplicate->bindParam(":contact_number", $contact_number);
        $stmtCheckDuplicate->execute();
        $duplicate = $stmtCheckDuplicate->fetch(PDO::FETCH_ASSOC);
    
        if($duplicate) {
            return json_encode(array("status" => 0, "message" => "Supplier with the same name or contact number already exists."));
        } else {
            // Proceed with inserting the new supplier
            $sqlInsertSupplier = "INSERT INTO supplier_list(name, address, contact_person , contact, status, date_created) ";
            $sqlInsertSupplier .= "VALUES(:supplier_name, :supplier_address, :contact_person, :contact_number, :status,  CURRENT_TIMESTAMP())";
    
            $stmtInsertSupplier = $conn->prepare($sqlInsertSupplier);
            $stmtInsertSupplier->bindParam(":supplier_name", $supplier_name);
            $stmtInsertSupplier->bindParam(":supplier_address", $supplier_address);
            $stmtInsertSupplier->bindParam(":contact_person", $contact_person);
            $stmtInsertSupplier->bindParam(":contact_number", $contact_number);
            $stmtInsertSupplier->bindParam(":status", $status);
    
            $stmtInsertSupplier->execute();
    
            if($stmtInsertSupplier->rowCount() > 0){
                return json_encode(array("status" => 1, "message" => "New Supplier successfully saved."));
            } else {
                return json_encode(array("status" => 0, "message" => "New Supplier registration was unsuccessful."));
            }
        }
    }

    function getSupplier(){
        include "connection.php";

        $sql = "SELECT * FROM supplier_list ORDER BY date_created DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt=null;

        return json_encode($returnValue);
    }

    function getSupplierById($supplier_id) {
        include "connection.php";
            
        $sql = "SELECT * FROM supplier_list WHERE supplier_id = :supplier_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":supplier_id", $supplier_id);
        $stmt->execute();
        
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $conn = null;
        $stmt = null;
        
        echo json_encode($userData);
    }

    function updateSupplier($json) {
        include "connection.php";
    
            $json = json_decode($json, true);
            $supplier_id = $json['supplier_id'];
            $name = $json['name'];
            $address = $json['address'];
            $contact_person = $json['contact_person'];
            $contact = $json['contact'];
            $status = $json['status'];

            $sql = "UPDATE supplier_list SET name = :name, address = :address, contact_person = :contact_person, contact = :contact, status = :status WHERE supplier_id = :supplier_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":supplier_id", $supplier_id);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":address", $address);
            $stmt->bindParam(":contact_person", $contact_person);
            $stmt->bindParam(":contact", $contact);
            $stmt->bindParam(":status", $status);
            $stmt->execute();
            
            if($stmt->rowCount() > 0){
                return json_encode(array("status" => 1, "message" => "Supplier Updated successfully saved."));
            } else {
                return json_encode(array("status" => 0, "message" => "Supplier update unsuccessful."));
            }
    }

    function getTotalCount(){
        include "connection.php";
    
        $sql = "SELECT COUNT(*) as total FROM supplier_list";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; $stmt = null;
    
        return $rowCount;
    }
}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];
$supplier_id = isset($_POST['supplier_id']) ? $_POST['supplier_id'] : "";

$supplier = new Supplier();

switch($operation){
    case "addSupplier":
        echo $supplier->addSupplier($json);
        break;
    case "updateSupplier":
        echo $supplier->updateSupplier($json);
        break;
    case "getSupplier":
        echo $supplier->getSupplier();
        break;
    case "getSupplierById":
        echo $supplier->getSupplierById($supplier_id);
        break;
    case "getTotalCount":
        echo $supplier->getTotalCount();
        break;
}

?>