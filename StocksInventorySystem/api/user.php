<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class SystemUser{
    function addUser() {
        include "connection.php";
    
        try {
            $conn->beginTransaction();
    
            $user_fname = $_POST["user_fname"];
            $user_lname = $_POST["user_lname"];
            $user_gender = $_POST["user_gender"];
            $user_contact = $_POST["user_contact"];
            $user_address = $_POST["user_address"];
            $user_email = $_POST["user_email"];
            $user_usrname = $_POST["user_usrname"];
            $user_pword = $_POST["user_pword"];
            $hashedPassword = password_hash($user_pword, PASSWORD_DEFAULT);
            $user_type = $_POST["user_type"];
            $status = $_POST["status"];
    
    
            $uploadDir = "avatar/";
            $uploadFile = $uploadDir . basename($_FILES['avatar']['name']);
    
            $sqlCheckUsername = "SELECT username FROM users WHERE username = :user_usrname";
            $stmtCheckUsername = $conn->prepare($sqlCheckUsername);
            $stmtCheckUsername->bindParam(":user_usrname", $user_usrname);
            $stmtCheckUsername->execute();
    
            if ($stmtCheckUsername->rowCount() > 0) {
                return json_encode(array("status" => 100, "message" => "Username already taken"));
            } else {
                if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadFile)) {
                    $sqlInsertUser = "INSERT INTO users(first_name, last_name, gender, contact, address, email, username, password, avatar, type, status, date_created) ";
                    $sqlInsertUser .= "VALUES(:user_fname, :user_lname, :user_gender, :user_contact, :user_address, :user_email, :user_usrname, :user_pword, :avatar, :user_type, :status, CURRENT_TIMESTAMP())";
    
                    $stmtInsertUser = $conn->prepare($sqlInsertUser);
                    $stmtInsertUser->bindParam(":user_fname", $user_fname);
                    $stmtInsertUser->bindParam(":user_lname", $user_lname);
                    $stmtInsertUser->bindParam(":user_gender", $user_gender);
                    $stmtInsertUser->bindParam(":user_contact", $user_contact);
                    $stmtInsertUser->bindParam(":user_address", $user_address);
                    $stmtInsertUser->bindParam(":user_email", $user_email);
                    $stmtInsertUser->bindParam(":user_usrname", $user_usrname);
                    $stmtInsertUser->bindParam(":user_pword", $hashedPassword);
                    $stmtInsertUser->bindParam(":avatar", $uploadFile);
                    $stmtInsertUser->bindParam(":user_type", $user_type);
                    $stmtInsertUser->bindParam(":status", $status);
    
                    $stmtInsertUser->execute();
    
                    if ($stmtInsertUser->rowCount() > 0) {
                        $conn->commit();
                        return json_encode(array("status" => 1, "message" => "New User successfully saved."));
                    } else {
                        $conn->rollBack();
                        return json_encode(array("status" => 2, "message" => "New User registration was unsuccessful."));
                    }
                }
            }
        } catch (Exception $e) {
            $conn->rollBack();
            return json_encode(array("status" => 500, "message" => "Internal Server Error"));
        }
    }

    function getSystemUser(){
        include "connection.php";

        $sql = "SELECT * FROM users ORDER BY date_created DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; $stmt=null;

        return json_encode($returnValue);
    }

    function getUsers($user_id) {
        include "connection.php";
            
        $sql = "SELECT * FROM users WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $conn = null;
        $stmt = null;
        
        echo json_encode($userData);
    }

    function updateUsers($json) {
        include "connection.php";
    
        $json = json_decode($json, true);
        $user_id = $json["user_id"];
        $user_fname = $json["first_name"];
        $user_lname = $json["last_name"];
        $user_gender = $json["gender"];
        $user_contact = $json["contact"];
        $user_address = $json["address"];
        $user_email = $json["email"];
        $user_usrname = $json["username"];
        $user_type = $json["type"];
        $status = $json["status"];
    
        $user_pword = isset($json["password"]) ? $json["password"] : null;
        $password_update_query = "";
        $password_binding = "";
        if ($user_pword !== null) {
            $hashed_password = password_hash($user_pword, PASSWORD_DEFAULT);
            $password_update_query = ", password = :password";
            $password_binding = ", :password";
        }
    
        $sql = "UPDATE users SET first_name = :first_name, last_name = :last_name, gender = :gender, contact = :contact, address = :address, email = :email, username = :username, type = :type, status = :status {$password_update_query} WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":first_name", $user_fname);
        $stmt->bindParam(":last_name", $user_lname);
        $stmt->bindParam(":gender", $user_gender);
        $stmt->bindParam(":contact", $user_contact);
        $stmt->bindParam(":address", $user_address);
        $stmt->bindParam(":email", $user_email);
        $stmt->bindParam(":username", $user_usrname);
        $stmt->bindParam(":type", $user_type);
        $stmt->bindParam(":status", $status);
        if ($user_pword !== null) {
            $stmt->bindParam(":password", $hashed_password);
        }
    
        $stmt->execute();
    
        if($stmt->rowCount() > 0){
            return json_encode(array("status" => 1, "message" => "User updated successfully."));
        } else {
            return json_encode(array("status" => 0, "message" => "User update unsuccessful."));
        }
    }    

    function updateProfile($json) {
        include "connection.php";
    
        $json = json_decode($json, true);
        $user_id = $json["user_id"];
        $user_fname = $json["first_name"];
        $user_lname = $json["last_name"];
        $user_gender = $json["gender"];
        $user_contact = $json["contact"];
        $user_address = $json["address"];
        $user_email = $json["email"];
        $user_usrname = $json["username"];
        $avatar = $json["avatar"];
    
        $user_pword = isset($json["password"]) ? $json["password"] : null;
        $password_update_query = "";
        $password_binding = "";
        if ($user_pword !== null) {
            $hashed_password = password_hash($user_pword, PASSWORD_DEFAULT);
            $password_update_query = ", password = :password";
            $password_binding = ", :password";
        }
    
        $sql = "UPDATE users SET first_name = :first_name, last_name = :last_name, gender = :gender, contact = :contact, address = :address, email = :email, username = :username, avatar = :avatar {$password_update_query} WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":first_name", $user_fname);
        $stmt->bindParam(":last_name", $user_lname);
        $stmt->bindParam(":gender", $user_gender);
        $stmt->bindParam(":contact", $user_contact);
        $stmt->bindParam(":address", $user_address);
        $stmt->bindParam(":email", $user_email);
        $stmt->bindParam(":username", $user_usrname);
        $stmt->bindParam(":avatar", $avatar);
        if ($user_pword !== null) {
            $stmt->bindParam(":password", $hashed_password);
        }
    
        $stmt->execute();
    
        if($stmt->rowCount() > 0){
            return json_encode(array("status" => 1, "message" => "Profile updated successfully."));
        } else {
            return json_encode(array("status" => 0, "message" => "Profile update unsuccessful."));
        }
    }    

    function getTotalCount(){
        include "connection.php";
    
        $sql = "SELECT COUNT(*) as total FROM users";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $conn = null; $stmt = null;
    
        return $rowCount;
    }
}

$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = $_POST['operation'];
$user_id = isset($_POST['user_id']) ? $_POST['user_id'] : "";

$system_user = new SystemUser();

switch($operation){
    case "addUser":
        echo $system_user->addUser();
        break;
    case "getSystemUser":
        echo $system_user->getSystemUser();
        break;
    case "getUsers":
        echo $system_user->getUsers($user_id);
        break;
    case "updateUsers":
        echo $system_user->updateUsers($json);
        break;
    case "updateProfile":
        echo $system_user->updateProfile($json);
        break;
    case "getTotalCount":
        echo $system_user->getTotalCount();
        break;
}

?>