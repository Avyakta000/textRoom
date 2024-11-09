// import { LogOut } from "lucide-react";
import useLogout from "../../hooks'/useLogout";
import { IoMdLogOut } from "react-icons/io";


const LogoutButton = () => {
    const {logout} = useLogout();

	return (
		<div className='mt-auto'>
			<IoMdLogOut className='w-8 h-8 text-white cursor-pointer' onClick={logout} />
		</div>
	);
};
export default LogoutButton;
