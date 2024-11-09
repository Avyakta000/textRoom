const GenderCheckbox = ({
	selectedGender,
	onCheckboxChange
}: {
	selectedGender:string;
	onCheckboxChange: (gender: "male" | "female") => void;
}) => {
	return (
		<div className='flex'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer`}>
					<span className='label-text'>Male</span>
					<input 
					type='checkbox' 
					className='checkbox border border-slate-200'
					checked={selectedGender === "male"}
					onChange={()=>onCheckboxChange("male")}
					 />
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer`}>
					<span className='label-text'>Female</span>
					<input 
					type='checkbox' 
					className='checkbox border border-slate-200'
					checked={selectedGender === "female"}
					onChange={()=>onCheckboxChange("female")}
					 />
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;