<?php
	// define('PG_DB', "DataGis");
	// define('PG_HOST', "localhost");
	// define('PG_USER', "postgres");
	// define('PG_PORT', "5432");
	// define('PG_PASS', "1");

	$conn_str = "host=localhost port=5432 dbname=DataGis user=postgres password=1";
	$conn = pg_connect($conn_str);
?>