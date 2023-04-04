const Spinner = () => (
  <div className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
    <div>
      <img src='spinner.svg' alt='Loading...' className='h-24' />
    </div>
  </div>
);

export default Spinner;
