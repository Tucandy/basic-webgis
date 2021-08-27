<?php
    include('./db/connection.php');
    if (isset($_GET['ten_vung'])) {
    	# code...
    	$ten_vung = $_GET['ten_vung'];
    	$name = strtolower($ten_vung);
    	$query = "
    		SELECT *, st_x(ST_Centroid(geom)) AS x, st_y(ST_Centroid(geom)) AS y 
    		FROM public.camhoangdc_1 
    		WHERE LOWER(txtmemo) LIKE '%$name%' OR LOWER(chusd) LIKE '%$name%'";
    	$result = pg_query($conn, $query);
    	$tong_so_ket_qua = pg_num_rows($result);

    		if ($tong_so_ket_qua > 0) {
    			# code...
    			while ($dong = pg_fetch_array($result, null, PGSQL_ASSOC)) {
    				# code...
    				$link = "<a href='javascript:void(0);' onClick='di_den_diem(".$dong['x'].",".$dong['y'].");'>Zoom to layer</a>";
    				print("Hiện trạng sử dụng: ".$dong["txtmemo"]."| Diện tích: ".$dong['shape_area']." " .$link. "</br>");
    			}
    		} else {
    			print("Không có thông tin");
    		}
    } else {
    	echo "Không có thông tin";
    }
?>