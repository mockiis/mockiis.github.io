<?php
        $db = mysql_connect('mysql.whampi.com', 'whampi', 'Dalaplan2000') or die('Failed to connect: ' . mysql_error());
        mysql_select_db('dbWhampi1') or die('Failed to access database');
		
		$username = mysql_real_escape_string($_GET['name'], $db);
		$score = mysql_real_escape_string($_GET['score'], $db);
		$hash = $_GET['hash'];
		$privateKey="OSTWHAMPI";
		
		$expected_hash = md5($username . $score . $privateKey);
		if($expected_hash == $hash) {
			$query = "SELECT  uo.*,
			(
				SELECT  COUNT(*)
				FROM    Scores ui
				WHERE   (ui.score, -ui.ts) >= (uo.score, -uo.ts)
			) AS rank
			FROM    Scores uo
			WHERE   name = '$name';";
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
        }
?>