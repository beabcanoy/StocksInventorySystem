<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class RawMaterial{
    function addRawMaterial($json){
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
        $name = $decoded_json['rawmat_description'];
        $status = $decoded_json['status'];
    
        $sqlCheckDuplicate = "SELECT COUNT(*) AS count FROM rawmat_list WHERE name = :name";
        $stmtCheckDuplicate = $conn->prepare($sqlCheckDuplicate);
        $stmtCheckDuplicate->bindParam(":name", $name);
        $stmtCheckDuplicate->execute();
        $rowCount = $stmtCheckDuplicate->fetch(PDO::FETCH_ASSOC)['count'];
    
        if ($rowCount > 0) {
            return json_encode(array("status" => 0, "message" => "This raw material already exists!"));
        }
    
        $sqlInsertRawMat = "INSERT INTO rawmat_list(name, status, date_created) ";
        $sqlInsertRawMat .= "VALUES(:name, :status,  CURRENT_TIMESTAMP())";
    
        $stmtInsertRawMat = $conn->prepare($sqlInsertRawMat);
        $stmtInsertRawMat->bindParam(":name", $name);
        $stmtInsertRawMat->bindParam(":status", $status);
    
        $stmtInsertRawMat->execute();
    
        if($stmtInsertRawMat->rowCount() > 0){
            return json_encode(array("status" => 1, "message" => "New Raw Material successfully saved."));
        } else {
            return json_encode(array("status" => 0, "message" => "New Raw Material registration was unsuccessful."));
        }
    }    

    function getRawMaterial(){
        include "connection.php";
    
        $sql = "SELECT * FROM rawmat_list ORDER BY date_created DESC ";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt=null;
    
        return json_encode($returnValue);
    }

    function getRawMaterialId($rawmat_id) {
        include "connection.php";
            
        $sql = "SELECT * FROM rawmat_list WHERE rawmat_id = :rawmat_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":rawmat_id", $rawmat_id);
        $stmt->execute();
        
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $conn = null;
        $stmt = null;
        
        echo json_encode($userData);
    }

    function updateMaterial($json) {
        include "connection.php";
    
            $json = json_decode($json, true);
            $rawmat_id = $json['rawmat_id'];
            $name = $json['name'];
            $status = $json['status'];

            $sql = "UPDATE rawmat_list SET name = :name, status = :status WHERE rawmat_id = :rawmat_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":rawmat_id", $rawmat_id);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":status", $status);
            $stmt->execute();
            
            if($stmt->rowCount() > 0){
                return json_encode(array("status" => 1, "message" => "Raw Material updated successfully saved."));
            } else {
                return json_encode(array("status" => 0, "message" => "Raw Material update unsuccessful."));
            }
    }

    function getTotalCount(){
        include "connection.php";
    
        $sql = "SELECT COUNT(*) as total FROM rawmat_list";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; $stmt = null;
    
        return $rowCount;
    }
}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];
$rawmat_id = isset($_POST['rawmat_id']) ? $_POST['rawmat_id'] : "";

$raw_material = new RawMaterial();

switch($operation){
    case "addRawMaterial":
        echo $raw_material->addRawMaterial($json);
        break;
    case "getRawMaterial":
        echo $raw_material->getRawMaterial();
        break;
    case "getTotalCount":
        echo $raw_material->getTotalCount();
        break;
    case "getRawMaterialId":
        echo $raw_material->getRawMaterialId($rawmat_id);
        break;
    case "updateMaterial":
        echo $raw_material->updateMaterial($json);
        break;
}

?>