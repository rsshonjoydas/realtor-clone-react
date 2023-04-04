import { useState } from 'react';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
  } = formData;

  console.log(setFormData);

  const onChange = () => {};

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='mt-6 text-3xl font-bold text-center'>Create a Listing</h1>

      <form>
        {/* //? Sell / Rent toggle button */}
        <p className='mt-6 text-lg font-semibold'>Sell / Rent</p>
        <div className='flex'>
          <button
            type='button'
            id='type'
            value='sale'
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'rent' ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            sell
          </button>
          <button
            type='button'
            id='type'
            value='rent'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'sale' ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            rent
          </button>
        </div>

        {/* //? Name of Listing */}
        <p className='mt-6 text-lg font-semibold'>Name</p>
        <input
          type='text'
          name='name'
          id='name'
          value={name}
          onChange={onChange}
          placeholder='Name'
          maxLength={32}
          minLength={10}
          required
          className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
        />

        {/* //? Beds and Baths room quantity */}
        <div className='flex mb-6 space-x-6'>
          <div>
            <p className='text-lg font-semibold'>Beds</p>
            <input
              type='number'
              id='bedrooms'
              value={bedrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-xl text-center text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Baths</p>
            <input
              type='number'
              id='bathrooms'
              value={bathrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-xl text-center text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
        </div>

        {/* //? Parking spot */}
        <p className='mt-6 text-lg font-semibold'>Parking spot</p>
        <div className='flex'>
          <button
            type='button'
            id='parking'
            value='true'
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            Yes
          </button>
          <button
            type='button'
            id='parking'
            value='false'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            no
          </button>
        </div>

        {/* //? Furnished */}
        <p className='mt-6 text-lg font-semibold'>Furnished</p>
        <div className='flex'>
          <button
            type='button'
            id='furnished'
            value='true'
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            yes
          </button>
          <button
            type='button'
            id='furnished'
            value='false'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            no
          </button>
        </div>

        {/* //? Address input */}
        <p className='mt-6 text-lg font-semibold'>Address</p>
        <textarea
          id='address'
          value={address}
          onChange={onChange}
          placeholder='Address'
          required
          className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
        />

        {/* //? Description */}
        <p className='text-lg font-semibold'>Description</p>
        <textarea
          id='description'
          value={description}
          onChange={onChange}
          placeholder='Description'
          required
          className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
        />

        {/* //? offer toggle button */}
        <p className='text-lg font-semibold'>Offer</p>
        <div className='flex mb-6'>
          <button
            type='button'
            id='offer'
            value='true'
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            yes
          </button>
          <button
            type='button'
            id='offer'
            value='false'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
          >
            no
          </button>
        </div>

        {/* //? regular and discount price */}
        <div className='flex items-center mb-6'>
          <div className=''>
            <p className='text-lg font-semibold'>Regular price</p>
            <div className='flex items-center justify-center w-full space-x-6'>
              <input
                type='number'
                id='regularPrice'
                value={regularPrice}
                onChange={onChange}
                min='50'
                max='400000000'
                required
                className='w-full px-4 py-2 text-xl text-center text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
              />
              {type === 'rent' && (
                <div className=''>
                  <p className='w-full text-md whitespace-nowrap'>$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className='flex items-center mb-6'>
            <div className=''>
              <p className='text-lg font-semibold'>Discounted price</p>
              <div className='flex items-center justify-center w-full space-x-6'>
                <input
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onChange}
                  min='50'
                  max='400000000'
                  required={offer}
                  className='w-full px-4 py-2 text-xl text-center text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
                />
                {type === 'rent' && (
                  <div className=''>
                    <p className='w-full text-md whitespace-nowrap'>$ / Month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* //? upload image */}
        <p className='text-lg font-semibold'>Images</p>
        <p className='mb-2 text-gray-600'>The first image will be the cover (max 6)</p>
        <input
          type='file'
          id='images'
          onChange={onChange}
          accept='.jpg,.png,.jpeg'
          multiple
          required
          className='relative px-4 py-2 mb-5 m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100'
        />

        {/* //? Create Listing button */}
        <button
          type='submit'
          className='w-full py-3 mb-6 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg'
        >
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
