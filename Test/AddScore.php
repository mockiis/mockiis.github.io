<?php
        $db = mysqli_connect('mysql.whampi.com', 'whampi', 'Dalaplan2000') or die('Failed to connect: ' . mysql_error());
        mysql_select_db('dbWhampi1') or die('Failed to access database');
		
		$username = mysql_real_escape_string($_GET['name'], $db);
		$score = mysql_real_escape_string($_GET['score'], $db);
		$hash = $_GET['hash'];
		$privateKey="OSTWHAMPI";
		
		$expected_hash = md5($username . $score . $privateKey);
		if($hash == $hash) {
			$query = "INSERT INTO Scores 
			SET name = 'Darius'
			, score = '100'
			, ts = CURRENT_TIMESTAMP
			ON DUPLICATE KEY UPDATE
			ts = if('$score'>score,CURRENT_TIMESTAMP,ts), score = if ('100'>score, '100', score);";
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
        }
?>