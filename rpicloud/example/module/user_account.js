/*
*/

R.event.on("user_account", function(){
	console.log("gpioXXXXXXXXXXXXXXXXXX");
	console.log(arguments[0]);
	
	switch(arguments[0][0]){
		case 'user_add':
		break;
		case 'user_del':
		break;
		case 'user_suspend':
		break;
		case 'user_resume':
		break;
		case 'user_update':
		break;
		case 'user_list':
		break;
		case 'user_get':
		break;
		case 'user_login':
		break;
		case 'user_logout':
		break;
		case 'user_action':
		break;
		default:
		break;
	}
});



