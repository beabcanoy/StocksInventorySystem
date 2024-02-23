<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    

class User{

    function login($json){
        include "connection.php";
    
        $decoded_json = json_decode($json, true);
        $username = $decoded_json["username"];
        $password = $decoded_json["password"];
    
        try {
            $sql = "SELECT * FROM users WHERE username = :username";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":username", $username);
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $hashedPasswordFromDB = $row['password'];
    
                if (password_verify($password, $hashedPasswordFromDB)) {
                    // Update last_login timestamp
                    $updateStmt = $conn->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = :username");
                    $updateStmt->bindParam(":username", $username);
                    $updateStmt->execute();
                    
                    unset($row['password']);
                    $response = array("user" => $row, "feedback" => "user record retrieved");
                } else  {
                    $response = array("error" => "Incorrect password", "feedback" => "user record not retrieved");
                }
            } else {
                $response = array("error" => "User not found", "feedback" => "user record not retrieved");
            }
        } catch (PDOException $e) {
            $response = array("error" => $e->getMessage(), "feedback" => "database error");
        } finally {
            $stmt = null;
            $conn = null;
        }
    
        return json_encode($response);
    }

    function getLoginHistory(){
        include "connection.php";

        $sql = "SELECT * FROM users ORDER BY last_login DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt=null;

        return json_encode($returnValue);
    }

}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];

$user = new User();
switch($operation){
    case "login":
        echo $user->login($json);
        break;
    case "getLoginHistory":
        echo $user->getLoginHistory();
        break;
}

?>