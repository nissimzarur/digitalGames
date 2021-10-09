<?php
 header('Access-Control-Allow-Origin: *'); 
 header("Access-Control-Allow-Credentials: true");
 header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
 header('Access-Control-Max-Age: 1000');
 header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
 header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");

 include_once("db_connection.php");

//Call to functions
$function = $_GET['function']??'';
if(!$function) echo json_encode(["success"=>false, "errMsg"=>"Not valid request!"]);

switch ($function) {
    case 'get_all_games':
        $results = get_all_games();
        break;
    case 'game_info':
        $results = game_info();
        break;
    case 'login':
        $results = login();
        break;
    case 'make_order':
        $results = make_order();
        break;
    case 'registrar':
        $results = registrar();
        break;
    case 'change_background_image':
        $results = change_background_image();
        break;
    case 'system_preferences':
        $results = system_preferences();
        break;
    case 'add_user':
        $results = add_user();
        break;
    case 'update_game_data':
        $results = update_game_data();
        break;
    case 'add_new_game':
        $results = add_new_game();
        break;
    case 'delete_game':
        $results = delete_game();
        break;
    case 'users_orders':
        $results = users_orders();
        break;
    case 'update_order':
        $results = update_order();
        break;
    case 'change_header_images':
        $results = change_header_images();
        break;
    case 'change_site_logo':
        $results = change_site_logo();
        break;
    case 'graph_data':
        $results = graph_data();
        break;
    case 'add_game_to_pre_order':
        $results = add_game_to_pre_order();
        break;
    case 'remove_game_from_pre_order_link':
        $results = remove_game_from_pre_order_link();
        break;
    case 'add_game_to_pre_order_link':
        $results = add_game_to_pre_order_link();
        break;
    case 'get_all_users':
        $results = get_all_users();
        break;
    
    default:
        # code...
        break;
}

function get_all_games(){
    global $pdo;

    $sql = "SELECT * FROM games";
    $stmt = $pdo->query($sql);
    $games = $stmt->fetchAll();
    
    if(!$games) echo json_encode(["success"=>false, "errMsg"=>"Fail to load games."]);
    else echo json_encode(["success"=>true, "data"=>$games]);
}

function game_info(){
    global $pdo;

    $game_id = (int)$_POST['game_id'];

    if(!$game_id) echo json_encode(["success"=>false, "errMsg"=>"Game id not valid!"]);
    else{
        $sql = "SELECT * FROM games WHERE id = $game_id";
        $stmt = $pdo->query($sql);
        $game = $stmt->fetch();
        
        if(!$game) echo json_encode(["success"=>false, "errMsg"=>"Fail to load game."]);
        else echo json_encode(["success"=>true, "data"=>$game]);
    }
}

function login(){
    global $pdo;

    $username = $_POST['username']?:'';
    $password = $_POST['password']?:'';

    if(!$username OR !$password) echo json_encode(['success'=>false, 'errMsg'=>"Some of the required params is missing."]);
    else{
        $sql = "SELECT * FROM users WHERE username='$username' AND password='$password' LIMIT 1";
        $stmt = $pdo->query($sql);
        $user = $stmt->fetch();

  


        if(!$user) echo json_encode(['success'=>false, 'errMsg'=>"User not found!"]);
        else{
            $sql = 
                "SELECT * "
                ."FROM pre_orders "
                ."INNER JOIN pre_orders_games_link ON pre_orders_games_link.pre_order_id = pre_orders.id "
                ."INNER JOIN games ON games.id = pre_orders_games_link.game_id "
                ."WHERE pre_orders.user_id = $user[id]";

                $stmt = $pdo->query($sql);
                $pre_order = $stmt->fetchAll();

                $data = [
                    "user"=>$user,
                    "pre_order"=>$pre_order??[]
                ];

            echo json_encode(['success'=>true, 'data'=>$data]);
            return true;
        }
    }
}

function make_order(){
    global $pdo;
    $user = json_decode($_POST['user'],true);
    $order = json_decode($_POST['order'],true);
    $comment = $order['comment']??'';
    $shipping_address = $order['shipping_address']??'';

    $games = $order['games'];
    $total_price = 0;

    $games_link_ids='';

    foreach ($games as $key => $game) {
        if(!$game['id'] OR !$game['price']) {
            echo json_encode(["success"=>false, 'errMsg'=>"Missing game data."]);
            return false;
        }
        $total_price += $game['price'];
    }

    $sql_params=[
       'user_id'=>$user['id'],
       'total_price'=>$total_price,
       'status'=>0,
       'comment'=>$comment,
       'shipping_address'=>$shipping_address
    ];
    $sql = "INSERT INTO orders (user_id, total_price, status, comment, shipping_address) VALUES(:user_id,:total_price,:status,:comment, :shipping_address)";
    $pdo->prepare($sql)->execute($sql_params);

    $order_id = $pdo->lastInsertId();

    foreach ($games as $key => $game) {
        $sql_params = [
            'game_id'=>$game['id'],
            'order_id'=>$order_id,
            'game_price'=>$game['price']
        ];

        $sql = "INSERT INTO order_games_link (`game_id`,`order_id`,`game_price`) VALUES (:game_id,:order_id,:game_price)";
        $pdo->prepare($sql)->execute($sql_params);
        if(!$pdo->lastInsertId()) {
            echo json_encode(["success"=>false, 'errMsg'=>"Fail to insert new order game."]);
            return false;
        }
    }

    if(!remove_all_games_from_pre_order($user['id'])){
        echo json_encode(["success"=>false, 'errMsg'=>"Order creted but pre order failed to deleted."]);
        return false;
    }
    else{
        echo json_encode(["success"=>true, 'data'=>"New order created."]);
        return true;
    }
}

function registrar(){
    global $pdo;
    $user = json_decode($_POST['user'],true);

    if(!$user OR !$user['f_name'] OR !$user['l_name'] OR !$user['username'] OR !$user['password']) {
        echo json_encode(["success"=>false, "errMsg"=>"Some user information are empty."]);
        return;
    }

    $sql = "INSERT INTO users (f_name, l_name, username, password) VALUES (:f_name,:l_name,:username,:password)";
    $pdo->prepare($sql)->execute($user);
    $user_id = $pdo->lastInsertId();

    if($user_id){
        $sql = "SELECT * FROM users WHERE id = $user_id";
        $stmt = $pdo->query($sql);
        $user = $stmt->fetch();

        echo json_encode(["success"=>true, 'data'=>$user]);
    }
    else echo json_encode(["success"=>false, "errMsg"=>"Failed to save user."]); 
}

function change_background_image(){
    global $pdo;

    $target_dir = "../public/assets/images/";
    $target_file = $target_dir . basename($_FILES["backgroundImageFile"]["name"]);
    $file_size = $_FILES["backgroundImageFile"]["size"];
    $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    if(!_checkImageBeforeUpload($target_dir, $file_size, $file_type)) {
        return false;
    }

    if (move_uploaded_file($_FILES["backgroundImageFile"]["tmp_name"], $target_file)) {
        $sql = "UPDATE system_preferences SET background_image=:backgroudImage";
        $pdo->prepare($sql)->execute(["backgroudImage"=>basename($_FILES["backgroundImageFile"]["name"])]);
        echo json_encode(["success"=>true, 'data'=>"The file ". htmlspecialchars( basename( $_FILES["backgroundImageFile"]["name"])). " has been uploaded."]);
        return true;
    } else {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error uploading your file."]);
        return false;
    }
    
}

function system_preferences(){
    global $pdo;

    $sql = "SELECT * FROM system_preferences";
    $stmt = $pdo->query($sql);
    $preferences = $stmt->fetch();

    echo json_encode(["success"=>true, 'data'=>$preferences]);
}

function add_user(){
    global $pdo;

    $f_name = $_POST['f_name']?:'';
    $l_name = $_POST['l_name']?:'';
    $username = $_POST['username']?:'';
    $password = $_POST['password']?:'';
    $is_admin = $_POST['is_admin'] == "true" ? 1 : 0;
    $is_super_admin = $_POST['is_super_admin'] == "true" ? 1 : 0;

    if(!$f_name OR !$l_name OR !$username OR !$password) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error with required user data."]);
        return false;
    }

    $userData = [
        "f_name"=>$f_name,
        "l_name"=>$l_name,
        "username"=>$username,
        "password"=>$password,
        "is_admin"=>$is_admin,
        "is_super_admin"=>$is_super_admin
    ];
    try {
        $sql = "INSERT INTO users (f_name, l_name, username, password, is_admin, is_super_admin) VALUES (:f_name,:l_name,:username,:password, :is_admin, :is_super_admin)";
        $pdo->prepare($sql)->execute($userData);
        $user_id = $pdo->lastInsertId();
    } catch (Exception $th) {
        if($th->getCode() == 23000){
            echo json_encode(["success"=>false, 'errMsg'=>"Sorry, username already exist."]);
            return false;
        }
        else{
            echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error adding new user."]);
            return false;
        }
    }


    if($user_id){
        echo json_encode(["success"=>true, 'data'=>"New user created."]);
        return true;
    }else{
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error adding new user."]);
        return false;
    }
}

function update_game_data(){
    $id = (int)$_POST['id'];

    if(!$id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, game id is not found"]);
        return false;
    }

    $game_data['id'] = $id;

    if(isset($_POST['title']) AND $_POST['title']) $game_data['title'] = $_POST['title']?:'';
    if(isset($_POST['description']) AND $_POST['description']) $game_data['description'] = $_POST['description']?:'';
    if(isset($_POST['price']) AND $_POST['price']) $game_data['price'] = $_POST['price']?:'';
    if(isset($_POST['category']) AND $_POST['category']) $game_data['category'] = $_POST['category']?:'';
    if(isset($_POST['is_active'])) $game_data['is_active'] = (int)$_POST['is_active'];
    if(isset($_POST['is_featured'])) $game_data['is_featured'] = (int)$_POST['is_featured'];

    if(isset($_FILES["gameImageFile"]) AND $_FILES["gameImageFile"] AND $_POST['original_img_path']){
        $target_dir = "../public/assets/images/";
        $target_file = $target_dir . basename($_FILES["gameImageFile"]["name"]);
        $file_size = $_FILES["gameImageFile"]["size"];
        $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    
        if(!_checkImageBeforeUpload($target_file, $file_size, $file_type)) {
            return false;
        }

        if (move_uploaded_file($_FILES["gameImageFile"]["tmp_name"], $target_file)) {
            unlink($target_dir.$_POST['original_img_path']);
            $game_data['img_path'] = $_FILES["gameImageFile"]["name"];
            start_update_game($game_data);
        } else {
            echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error uploading your file."]);
            return false;
        }
    }else{
        start_update_game($game_data);
    }
    
}

function start_update_game($game_data=[]){
    global $pdo;

    if(!$game_data OR !$game_data['id']) return false;

    $sql = "UPDATE games SET";
    $sql_values = '';

    if(isset($game_data['title'])) $sql_values.=($sql_values?", ":' ')."title=:title";
    if(isset($game_data['description'])) $sql_values.=($sql_values?", ":' ')."description=:description";
    if(isset($game_data['price'])) $sql_values.=($sql_values?", ":' ')."price=:price";
    if(isset($game_data['category'])) $sql_values.=($sql_values?", ":' ')."category=:category";
    if(isset($game_data['is_active'])) $sql_values.=($sql_values?", ":' ')."is_active=:is_active";
    if(isset($game_data['is_featured'])) $sql_values.=($sql_values?", ":' ')."is_featured=:is_featured";
    if(isset($game_data['img_path'])) $sql_values.=($sql_values?", ":' ')."img_path=:img_path";

    $sql .= $sql_values." WHERE id=:id";

    $rowsEffected = 0;
    try {
        //code...
        $count = $pdo->prepare($sql);
        $count->execute($game_data);
        $rowsEffected=$count->rowCount();

    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, update failed."]);
        return true;
    }

    if(!$rowsEffected){
        echo json_encode(["success"=>false, 'errMsg'=>"You sure you update some data? try again..."]);
        return false;
    }
    else{
        echo json_encode(["success"=>true, 'data'=>"The game updated successfully"]);
        return true;
    }
}

function add_new_game(){
    global $pdo;

    $title = $_POST['title']?:'';
    $description = $_POST['description']?:'';
    $price = is_numeric($_POST['price'])?$_POST['price']:'';
    $category = (int)$_POST['category'];
    $is_active = (int)$_POST['is_active'];
    $is_featured = (int)$_POST['is_featured'];

    if(!$title OR !$description OR !$price OR !$category){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, required fields are missing."]);

        return false;
    }
    
    if(!isset($_FILES["newGameImage"]) OR !$_FILES["newGameImage"]){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, game image is required."]);
        return false;
    }else{
        $target_dir = "../public/assets/images/";
        $target_file = $target_dir . basename($_FILES["newGameImage"]["name"]);
        $file_size = $_FILES["newGameImage"]["size"];
        $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        if(!_checkImageBeforeUpload($target_file, $file_size, $file_type)) {
            return false;
        }

        if (move_uploaded_file($_FILES["newGameImage"]["tmp_name"], $target_file)) {
            $game_image_file_path = $_FILES["newGameImage"]["name"];

            $sql_params = [
                'title'=>$title,
                'description'=>$description,
                'price'=>$price,
                'category'=>$category,
                'is_active'=>$is_active,
                'is_featured'=>$is_featured,
                'img_path'=>$game_image_file_path,
            ];
            
            $sql = "INSERT INTO games SET "
                ."title = :title, "
                ."description = :description, "
                ."price = :price, "
                ."category = :category, "
                ."is_active = :is_active, "
                ."is_featured = :is_featured, "
                ."img_path = :img_path";

            try {
                $pdo->prepare($sql)->execute($sql_params);
            } catch (\Throwable $th) {
                echo json_encode(["success"=>false, 'errMsg'=>"Sorry, adding new game failed."]);
                return false;
            }

            $game_id = $pdo->lastInsertId();

            if($game_id){
                echo json_encode(["success"=>true, 'data'=>"New game added successfully."]);
                return true;
            }else{
                echo json_encode(["success"=>false, 'errMsg'=>"Sorry, adding new game failed."]);
                return false;
            }

        } else {
            echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error uploading your file."]);
            return false;
        }
    }
  
}

function delete_game(){
    global $pdo;

    $game_id = (int)$_POST['game_id'];
    if(!$game_id) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, game id is required."]);
        return false;
    }

    $sql_params = [
        'game_id'=>$game_id
    ];
    $sql = "DELETE FROM games WHERE id = :game_id";
    $count = $pdo->prepare($sql);
    try {
        $count->execute($sql_params);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, adding new game failed."]);
        return false;
    }

    if($count->rowCount()){
        echo json_encode(["success"=>true, 'data'=>"The game have been deleted successfully."]);
        return true;
    }
    else{
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, failed to delete the game."]);
        return false;
    }
}

function users_orders(){
    global $pdo;

    $sql = 
        "SELECT orders.id AS order_id, orders.total_price, orders.status, orders.shipping_address, "
            ."orders.comment, orders.created_at, users.f_name, users.l_name, users.id AS user_id "
        ."FROM orders "
        ."INNER JOIN users ON orders.user_id = users.id";

    $stmt = $pdo->query($sql);
    $orders = $stmt->fetchAll();
    
    if(!$orders){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, no orders found."]);
        return false;
    }

    $sql = "SELECT * FROM order_games_link";
    $stmt = $pdo->query($sql);
    $orders_games = $stmt->fetchAll();

    foreach ($orders as $order_key => $order) {
        foreach ($orders_games as $key => $game) {
            if($order['order_id'] == $game['order_id']){
                $orders[$order_key]['games_list'][]=$game;
            }
        }
    }

    echo json_encode(["success"=>true, 'data'=>$orders]);
    return true;
}

function update_order (){
    global $pdo;

    $order_id = ($_POST AND isset($_POST['order_id'])) ? (int)$_POST['order_id'] : false;

    if(!$_POST OR !$order_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, no changes have been made."]);
        return false;
    }

    $total_price = isset($_POST['total_price']) ? $_POST['total_price'] : false;
    $status = isset($_POST['status'])?(int)$_POST['status']:false;
    $comment = isset($_POST['comment'])?$_POST['comment']:false;;
    $shipping_address = isset($_POST['shipping_address'])?$_POST['shipping_address']:false;

    $sql = "UPDATE orders SET ";
    $sql_params = '';
    $params_values = [];

    $params_values['order_id'] = $order_id;

    if($total_price){
        $sql_params .= (!empty($sql_params)?', ':'')."total_price = :total_price";
        $params_values['total_price'] = $total_price;
    }
    if(isset($_POST['status'])){
        $sql_params .= (!empty($sql_params)?', ':'')."status = :status";
        $params_values['status'] = $status;
    }
    if($comment){
        $sql_params .= (!empty($sql_params)?', ':'')."comment = :comment";
        $params_values['comment'] = $comment;
    }
    if($shipping_address){
        $sql_params .= (!empty($sql_params)?', ':'')."shipping_address = :shipping_address";
        $params_values['shipping_address'] = $shipping_address;
    }

    $sql .= $sql_params." WHERE id = :order_id";

    $count = $pdo->prepare($sql);
    try {
        $count->execute($params_values);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, error occurred while update process."]);
        return false;
    }

    if($count->rowCount()){
        echo json_encode(["success"=>true, 'data'=>"Order update have been made successfully."]);
        return true;
    }else{
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, order update failed."]);
        return false;
    }
}

function change_header_images(){
    global $pdo;

    $image1 = (isset($_FILES["headerImage1"]) AND $_FILES["headerImage1"]) ? $_FILES["headerImage1"] : false;
    $image2 = (isset($_FILES["headerImage2"]) AND $_FILES["headerImage2"]) ? $_FILES["headerImage2"] : false;
    $image3 = (isset($_FILES["headerImage3"]) AND $_FILES["headerImage3"]) ? $_FILES["headerImage3"] : false;
    
    $old_image1_path = (isset($_POST["oldHeaderImage1"]) AND $_POST["oldHeaderImage1"]) ? $_POST["oldHeaderImage1"] : false;
    $old_image2_path = (isset($_POST["oldHeaderImage2"]) AND $_POST["oldHeaderImage2"]) ? $_POST["oldHeaderImage2"] : false;
    $old_image3_path = (isset($_POST["oldHeaderImage3"]) AND $_POST["oldHeaderImage3"]) ? $_POST["oldHeaderImage3"] : false;

    $target_dir = "../public/assets/images/";

    if($image1 AND $old_image1_path){
        $target_file = $target_dir . basename($image1["name"]);
        $file_size = $image1["size"];
        $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    
        if(!_checkImageBeforeUpload($target_file, $file_size, $file_type)) {
            return false;
        }
 
        if (move_uploaded_file($image1["tmp_name"], $target_file)) {
            unlink($target_dir.$old_image1_path);
            _updateHeaderImages(["path"=>$image1["name"], "header_image"=>1]);
        } 
    }

    if($image2 AND $old_image2_path){
        $target_file = $target_dir . basename($image2["name"]);
        $file_size = $image2["size"];
        $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        if(!_checkImageBeforeUpload($target_file, $file_size, $file_type)) {
            return false;
        }

        if (move_uploaded_file($image2["tmp_name"], $target_file)) {
            unlink($target_dir.$old_image2_path);
            _updateHeaderImages(["path"=>$image2["name"], "header_image"=>2]);
        } 
    }

    if($image3 AND $old_image3_path){
        $target_file = $target_dir . basename($image3["name"]);
        $file_size = $image3["size"];
        $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        if(!_checkImageBeforeUpload($target_file, $file_size, $file_type)) {
            return false;
        }

        if (move_uploaded_file($image3["tmp_name"], $target_file)) {
            unlink($target_dir.$old_image3_path);
            _updateHeaderImages(["path"=>$image3["name"], "header_image"=>3]);
        } 
    }

    echo json_encode(["success"=>true, 'data'=>"Header images have been updated successfully."]);
    return true;
}

function change_site_logo(){
    global $pdo;

    $logo_image = (isset($_FILES["logoImage"]) AND $_FILES["logoImage"]) ? $_FILES["logoImage"] : false;
    $old_logo_image_path = (isset($_POST["oldLogoImage"]) AND $_POST["oldLogoImage"]) ? $_POST["oldLogoImage"] : false;
    $target_dir = "../public/assets/images/";

    if($logo_image AND $old_logo_image_path){
        $target_file = $target_dir . basename($logo_image["name"]);
        $file_size = $logo_image["size"];
        $file_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    
        if(!_checkImageBeforeUpload($target_file, $file_size, $file_type)) {
            return false;
        }
 
        try {
            unlink($target_dir.$old_logo_image_path);
        } catch (\Throwable $th) {
            //throw $th;
        }
        if (move_uploaded_file($logo_image["tmp_name"], $target_file)) {

            $sql = "UPDATE system_preferences SET logo_image=:path";
            try {
                $pdo->prepare($sql)->execute(["path"=>$logo_image["name"]]);
                echo json_encode(["success"=>true, 'data'=>"Logo image have been changed successfully."]);
                return true;
            } catch (\Throwable $th) {
                echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error uploading your file."]);
                return false;
            }
        } 
    }

}

function graph_data(){
    global $pdo;

    $sql = "SELECT * FROM orders";
    try {
        $stmt = $pdo->query($sql);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, error occurred while fetching all orders."]);
        return false;
    }
    $results = $stmt->fetchAll();

    if(!$results){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, no orders had found."]);
        return false;
    }

    $temp_graph_data = [
        1=>[
            "name"=>"January",
            "total_orders"=>0
        ],
        2=>[
            "name"=>"February",
            "total_orders"=>0
        ],
        3=>[
            "name"=>"March",
            "total_orders"=>0
        ],
        4=>[
            "name"=>"April",
            "total_orders"=>0
        ],
        5=>[
            "name"=>"May",
            "total_orders"=>0
        ],
        6=>[
            "name"=>"June",
            "total_orders"=>0
        ],
        7=>[
            "name"=>"July",
            "total_orders"=>0
        ],
        8=>[
            "name"=>"August",
            "total_orders"=>0
        ],
        9=>[
            "name"=>"September",
            "total_orders"=>0
        ],
        10=>[
            "name"=>"October",
            "total_orders"=>0
        ],
        11=>[
            "name"=>"November",
            "total_orders"=>0
        ],
        12=>[
            "name"=>"December",
            "total_orders"=>0
        ]
    ];

    $orders_per_month = [];
    foreach ($results as $key => $row) {
        if((int)date("m", strtotime($row['created_at'])) == 1) $orders_per_month[1]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 2) $orders_per_month[2]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 3) $orders_per_month[3]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 4) $orders_per_month[4]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 5) $orders_per_month[5]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 6) $orders_per_month[6]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 7) $orders_per_month[7]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 8) $orders_per_month[8]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 9) $orders_per_month[9]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 10) $orders_per_month[10]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 11) $orders_per_month[11]["orders"][] = $row;
        if((int)date("m", strtotime($row['created_at'])) == 12) $orders_per_month[12]["orders"][] = $row;
    }

    foreach ($orders_per_month as $key => $order_per_month) {
        $temp_graph_data[$key]['total_orders'] = (int)count($order_per_month['orders']);
    }

    $graph_data = [];
    foreach ($temp_graph_data as $key => $value) {
        if($key > (int)date('m')) break;
        $graph_data[] = $value;
    }

    if($graph_data){
        echo json_encode(["success"=>true, 'data'=>$graph_data]);
        return true;
    }
    else{
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, no orders had found."]);
        return false;
    }
}

function add_game_to_pre_order(){
    global $pdo;

    $game_id = (int)$_POST['game_id'];
    $user_id = (int)$_POST['user_id'];

    if(!$game_id OR !$user_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, missing required data."]);
        return false;
    }

    $sql = "INSERT INTO pre_orders (`user_id`) VALUES (:user_id) ON DUPLICATE KEY UPDATE created_at=NOW()";

    try {
        $pdo->prepare($sql)->execute(["user_id"=>$user_id]);
    } catch (\Throwable $th) {
        
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, adding game to pre order failed."]);
        return false;
    }

    $pre_order_id = $pdo->lastInsertId();
    
    if(!$pre_order_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, adding game to pre order failed."]);
        return false;
    }

    $sql = "INSERT INTO pre_orders_games_link SET pre_order_id = :pre_order_id, game_id = :game_id";

    try {
        $pdo->prepare($sql)->execute(["pre_order_id"=>$pre_order_id,"game_id"=>$game_id]);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'errMsg'=>$th->getMessage()]);
        return false;
    }

    $pre_orders_games_link_id = $pdo->lastInsertId();

    if(!$pre_order_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, adding game to pre orders games link failed."]);
        return false;
    }

    echo json_encode(["success"=>true, 'data'=>"Game added to the pre order list successfully."]);
    return true;
}

function remove_game_from_pre_order_link(){
    global $pdo;

    $user_id = (int)$_POST['user_id'];
    $game_id = (int)$_POST['game_id'];

    if(!$user_id OR !$game_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, missing required data."]);
        return false;
    }

    $sql = "SELECT MAX(pre_orders_games_link.id) AS id "
        ."FROM pre_orders "
        ."INNER JOIN pre_orders_games_link ON pre_orders_games_link.pre_order_id = pre_orders.id AND game_id = $game_id "
        ."WHERE user_id = $user_id";

    $stmt = $pdo->query($sql);
    $pre_orders_games_link_data = $stmt->fetch();

    $sql = "DELETE FROM pre_orders_games_link WHERE id = :pre_orders_games_link_id";

    $count = $pdo->prepare($sql);
    try {
        $count->execute(["pre_orders_games_link_id"=>(int)$pre_orders_games_link_data['id']]);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, removing game from the pre order failed."]);
        return false;
    }

    if(!$count->rowCount()){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, failed to delete game from pre order."]);
        return false;
    }
    
    echo json_encode(["success"=>true, 'data'=>"The game have been deleted successfully from the pre order."]);
    return true;
}

function add_game_to_pre_order_link(){
    global $pdo;

    $user_id = (int)$_POST['user_id'];
    $game_id = (int)$_POST['game_id'];

    if(!$user_id OR !$game_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, missing required data."]);
        return false;
    }

    $sql = "SELECT id FROM pre_orders WHERE user_id = $user_id";
    $stmt = $pdo->query($sql);
    $pre_order_data = $stmt->fetch();

    $sql = "INSERT INTO pre_orders_games_link SET pre_order_id = :pre_order_id, game_id = :game_id";
    $pdo->prepare($sql)->execute(["pre_order_id"=>$pre_order_data['id'], "game_id"=>$game_id]);
    $pre_orders_games_link_id = $pdo->lastInsertId();

    if(!$pre_orders_games_link_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, failed to add game."]);
        return false;
    }

    echo json_encode(["success"=>true, 'data'=>"The added successfully to the pre order."]);
    return true;
}

function remove_all_games_from_pre_order($user_id=0){
    global $pdo;

    if(!$user_id){
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, missing required data."]);
        return false;
    }

    $sql = "SELECT id FROM pre_orders WHERE user_id = $user_id";
    $stmt = $pdo->query($sql);
    $pre_order_data = $stmt->fetch();

    $sql = "DELETE FROM pre_orders_games_link WHERE pre_order_id = :pre_order_id";
    $count = $pdo->prepare($sql);
    $count->execute(["pre_order_id"=>$pre_order_data['id']]);

    if(!$count->rowCount()){
        return false;
    }
    
    return true;
}

function get_all_users(){
    global $pdo;

    $sql = "SELECT f_name, l_name, username, created_at FROM users ORDER BY id";
    $stmt = $pdo->query($sql);
    $users = $stmt->fetchAll();

    if(!$users) {
        echo json_encode(["success"=>false, 'errMsg'=>"No users found."]);
        return false;
    }

    echo json_encode(["success"=>true, 'data'=>$users]);
    return true;
}

//Generic functions.
function _updateHeaderImages($params=[]){
    global $pdo;

    if($params["header_image"] == 1) $sql = "UPDATE system_preferences SET header_image_1=:path";
    if($params["header_image"] == 2) $sql = "UPDATE system_preferences SET header_image_2=:path";
    if($params["header_image"] == 3) $sql = "UPDATE system_preferences SET header_image_3=:path";
    
    $count = $pdo->prepare($sql);
    try {
        $count->execute(["path"=>$params['path']]);
    } catch (\Throwable $th) {
        return false;
    }

    if($count->rowCount()){
        return true;
    }
    else{
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, there was an error uploading your file."]);
        return false;
    }
};

function _checkImageBeforeUpload($target_file, $file_size, $file_type){
    // Check file size
    if ($file_size > 3000000) {
        echo json_encode(["success"=>false, 'errMsg'=>"Sorry, your file is too large."]);
        return false;
    }

    // Allow certain file formats
    if($file_type != "jpg" && $file_type != "png" && $file_type != "jpeg"
        && $file_type != "gif" ){
            echo json_encode(["success"=>false, 'errMsg'=>"Sorry, only JPG, JPEG, PNG & GIF files are allowed."]);
            return false;
        }

    return true;
}

?>

