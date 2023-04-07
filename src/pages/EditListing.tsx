import { getAuth } from 'firebase/auth';
import { DocumentReference, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';
import { firestore } from '../config/firebase';

interface ImageFile extends File {
  preview?: string;
}

interface Listing {
  [x: string]: string | undefined;
  id: string;
  data: any; // Replace 'any' with the actual type of your listing data
}

interface FormData {
  type: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  description: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number;
  images: any[];
}

const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<FormData>({
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
    images: [],
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
    images,
  } = formData;

  const navigate = useNavigate();
  const params: any = useParams();
  const auth = getAuth();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser?.uid) {
      toast.error("You can't edit this listing");
      navigate('/');
    }
  }, [auth.currentUser?.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(firestore, 'listings', params.listingId) as DocumentReference<Listing>;
      const docSnap: any = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist');
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement | any>) => {
    let boolean: boolean | null = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    const { files } = e.target as HTMLInputElement | any;
    // ? files
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        images: files,
      }));
    }

    // ? Text/Boolean/Number
    if (!files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement | any>) => {
    e.preventDefault();

    setLoading(true);

    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.warn('Discounted price needs to be less than regular price');
      return true;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.warn('maximum 6 images are allowed');
      return true;
    }

    async function storeImage(image: ImageFile): Promise<string> {
      return new Promise((resolve, reject) => {
        const filename = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;
        const storage = getStorage();
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all([...images].map((image) => storeImage(image))).catch(
      (error: any) => {
        setLoading(false);
        toast.error('Images not uploaded');
        console.log('🚀 ~ file: CreateListing.tsx:140 ~ onSubmit ~ error:', error);
      }
    );

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser?.uid,
      images: undefined,
    };

    delete formDataCopy.images;

    formDataCopy.timestamp = serverTimestamp(); // ? use the timestamp property

    const docRef = doc(firestore, 'listings', params.listingId);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success('Listing edited successfully!');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);

    return true;
  };

  if (loading) return <Spinner />;

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='mt-6 text-3xl font-bold text-center'>Edit Listing</h1>

      <form onSubmit={onSubmit}>
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
          className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600'
        />

        {/* //? Description */}
        <p className='text-lg font-semibold'>Description</p>
        <textarea
          id='description'
          value={description}
          onChange={onChange}
          placeholder='Description'
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
          className='relative px-4 py-2 mb-5 m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100'
        />

        {/* //? Create Listing button */}
        <button
          type='submit'
          className='w-full py-3 mb-6 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg'
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
