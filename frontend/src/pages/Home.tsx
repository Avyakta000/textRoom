import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='flex h-[100vh] w-full md:max-w-screen-lg rounded-lg overflow-hidden bg-gray-900'>
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
