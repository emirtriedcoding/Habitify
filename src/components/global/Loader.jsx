const Loader = () => {
  return (
    <div className="h-screen w-full bg-black">
      <div className="fixed inset-0 flex items-center justify-center">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    </div>
  );
};

export default Loader;
