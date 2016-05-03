<?php
$username = "whampi";
$password = "Dalaplan2000";
$hostname = "mysql.whampi.com"; 

//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password) 
 or die("Unable to connect to MySQL");
echo "Connected to MySQL<br>";

//select a database to work with
$selected = mysql_select_db("dbWhampi1",$dbhandle) 
  or die("Could not select dbWhampi1");

//execute the SQL query and return records
$result = mysql_query("INSERT INTO Scores (name, score) VALUES( Darius, 2000)");

}
//close the connection
mysql_close($dbhandle);
?>
