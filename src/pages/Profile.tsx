import { getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FcHome } from 'react-icons/fc';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import { firestore } from '../config/firebase';

interface Listing {
  id: string;
  data: any; // Replace 'any' with the actual type of your listing data
}

// Define the custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '2rem',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '1000',
  },
};

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingIdToDelete, setListingIdToDelete] = useState('');

  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [changeName, setChangeName] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
  });
  const { name, email } = formData;

  const logout = () => {
    auth.signOut();

    navigate('/');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    const { currentUser }: any = auth;

    try {
      if (auth.currentUser?.displayName !== name) {
        // ? update display name in firebase authentication
        await updateProfile(currentUser, {
          displayName: name,
        });

        // ? update name in firestore
        const docRef = doc(firestore, 'users', currentUser.uid);
        await updateDoc(docRef, {
          name,
        });

        toast.success('Profile updated successfully!');
      } else {
        toast.warn("You don't change anything!");
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(firestore, 'listings');
      const q = query(
        listingRef,
        where('userRef', '==', auth.currentUser?.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);
      const listing: any = [];
      querySnap.forEach((docs) =>
        listing.push({
          id: docs.id,
          data: docs.data(),
        })
      );
      setListings(listing);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser?.uid]);

  const onDelete = async (listingID: string) => {
    // Store the ID of the listing to be deleted in state
    setListingIdToDelete(listingID);

    // Open the modal
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (listingIdToDelete && listings !== null) {
      // Add a null check for listings
      await deleteDoc(doc(firestore, 'listings', listingIdToDelete));
      const updatedListings = listings.filter((listing) => listing.id !== listingIdToDelete);
      setListings(updatedListings);
      toast.success('Successfully deleted the listing');
    }

    // Close the modal
    setIsModalOpen(false);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  function onEdit(listingID: any) {
    navigate(`/edit-listing/${listingID}`);
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Delete Listing Modal'
      >
        <h2 className='mb-4 text-xl font-bold'>Confirm Delete</h2>
        <p className='mb-4'>Are you sure you want to delete this listing?</p>
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={confirmDelete}
            className='px-4 py-2 mr-2 text-white bg-red-600 rounded'
          >
            Delete
          </button>
          <button
            type='button'
            onClick={closeModal}
            className='px-4 py-2 text-gray-700 bg-gray-300 rounded'
          >
            Cancel
          </button>
        </div>
      </Modal>

      <section className='flex flex-col items-center justify-center max-w-6xl mx-auto'>
        <h1 className='mt-6 text-3xl font-bold text-center'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3 '>
          <form>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              disabled={!changeName}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeName && 'bg-red-200 focus:bg-red-200'
              }`}
            />
            <input
              type='text'
              name='email'
              id='email'
              value={email}
              disabled
              className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 roundedmb-6 '
            />
            <div className='flex justify-between text-sm sm:text-lg whitespace-nowrap'>
              <p className='flex items-center'>
                Do you want to change your name?
                <span
                  onClick={() => {
                    if (changeName) {
                      onSubmit();
                      setChangeName((prevState) => !prevState);
                    }
                  }}
                  className='ml-1 text-red-500 transition duration-200 ease-in-out cursor-pointer hover:text-red-600'
                >
                  {changeName ? 'Change' : 'Edit'}
                </span>
              </p>
              <p
                onClick={logout}
                className='text-blue-500 transition duration-200 ease-in-out cursor-pointer hover:text-blue-600'
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type='submit'
            className='w-full py-3 mt-6 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800'
          >
            <Link to='/create-listing' className='flex items-center justify-center'>
              <FcHome className='p-1 mr-2 text-3xl bg-red-200 border-2 rounded-full' />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>

      <div className='max-w-6xl px-3 mx-auto mt-6'>
        {!loading && listings?.length && (
          <>
            <h2 className='mb-6 text-2xl font-semibold text-center'>My Listings</h2>
            <ul className='grid-cols-2 sm:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {listings.map((listing: any) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
