<?php





$username="ryantyler";$password="Bob44al88";$database="Weightlifting";
$con = mysqli_connect("127.0.0.1","ryantyler",$password,$database);
if (!$con) {
    die("connection failed: " . mysqli_connect_error());
                }
               
$eventId = $_GET["eventId"];

 

 

$query = <<<DEMO

SELECT eventName, dateHeld, ageGroup, location
FROM event 
ORDER BY ageGroup DESC



DEMO;

   
$result=mysqli_query($con,$query);
if (!$result) {
    die("error:  " . mysqli_error($con). " " . $query);
}
$row = mysqli_fetch_assoc($result);
if(!$row) {
die( "error2" . $query);
}

 
while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
    $arr[] = array("eventName" => $row["eventName"], "dateHeld" => $row["dateHeld"], "ageGroup" => $row["ageGroup"], "location" => $row["location"]);
    
}
$items["items"] = $arr;
echo json_encode($arr);
     

mysqli_free_result($result);
mysqli_close($con);
?>
