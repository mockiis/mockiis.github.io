<?php  
	$servername="mysql.whampi.com";
	$username="whampi";
	$password="Dalaplan2000";
	$dbname="dbWhampi1";
	
	$conn= new mysqli($servername,$username,$password,$dbname);
	
	if(!$conn){
		die("connection failed. ".mysqli_connect_error());
	}
	
	$sql ="SELECT * FROM Scores";
	$result = mysqli_query($conn,$sql);
	
	if(mysqli_num_rows($result) > 0){
		while($row = mysqli_fetch_assoc($result){
			echo "test: " .$row['name'] ";".row['score']
		}
	}
	
?> 


