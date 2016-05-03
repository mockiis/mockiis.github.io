define('DB_USER', "whampi"); // db user  
define('DB_PASSWORD', "Dalaplan2000"); // db password  
define('DB_DATABASE', "dbWhampi1"); // database name  
define('DB_SERVER', "mysql.whampi.com"); // db server/ host name  
<?php  
/** 
* A class file to connect to database 
*/  
class DATABASE_CONNECT {  
// constructor  
function __construct() {  
// connecting to database  
$this->connect();  
}  
// destructor  
function __destruct() {  
// closing db connection  
$this->close();  
}  
function connect() {  
$con = mysql_connect(DB_SERVER, DB_USER, DB_PASSWORD) or die(mysql_error());  
$db = mysql_select_db(DB_DATABASE) or die(mysql_error()) or die(mysql_error());  
return $con;  
}  
/** 
* Function to close db connection 
*/  
function close() {  
// closing db connection  
mysql_close();  
}  
}  
?>  
$MY_DB = new DB_CONNECT();  