define('NAME', "darius"); // db user  
define('SCORE', "2000"); // db password 
<?php   
	$db = new DB_CONNECT();  
      $result = mysql_query("INSERT INTO Scores (name, score) VALUES('Darius', '2000')");  
      // check if row inserted or not  
      if ($result) {  
         $response["success_msg"] = 1;  
         $response["message"] = "Product successfully Insert.";  
         echo json_encode($response);  
      } else {  
         // failed to insert row  
         $response["success_msg "] = 0;  
         $response["message"] = "Product not insert because Oops! An error occurred.";  
         // echoing JSON response  
         echo json_encode($response);  
      }  
?> 
