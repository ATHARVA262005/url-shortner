const AdBanner = ({ type }) => {
  return (
    <div className={`
      bg-white rounded-xl shadow-md p-6
      ${type === 'vertical' ? 'w-[300px] h-[600px]' : 'w-full h-[100px]'}
      flex items-center justify-center
      transition-shadow duration-300 hover:shadow-lg
    `}>
      <p className="text-gray-400 text-sm">Advertisement</p>
    </div>
  );
};

export default AdBanner;
