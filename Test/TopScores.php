<?php
        $db = mysql_connect('mysql.whampi.com', 'whampi', 'Dalaplan2000') or die('Failed to connect: ' . mysql_error());
        mysql_select_db('dbWhampi1') or die('Failed to access database');
		
		$username = mysql_real_escape_string($_GET['name'], $db);
		$score = mysql_real_escape_string($_GET['score'], $db);
		$hash = $_GET['hash'];
		$privateKey="OSTWHAMPI";
		
		$expected_hash = md5($username . $score . $privateKey);
		if($expected_hash == $hash) {
			$query = "SELECT * FROM Scores ORDER by score DESC, ts ASC LIMIT 10";
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
			
			$result_length = mysql_num_rows($result);
			for($i = 0; $i < $result_length; $i++)
			{
				$row = mysql_fetch_array($result);
				echo $row['name'] . "\t" . $row['score'] . "\n";
			}
        }
?>