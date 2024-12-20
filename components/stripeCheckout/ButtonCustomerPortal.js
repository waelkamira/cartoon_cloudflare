'use client';

import { useAuth, signIn } from '../components/authContext/AuthContext';

// Customer portal link
const customerPortalLink = 'https://buy.stripe.com/test_3cs00Y2SS1No9zybII';

const ButtonCustomerPortal = () => {
  const { data: session, status } = useAuth();

  if (status === 'authenticated') {
    return (
      <a
        href={customerPortalLink + '?prefilled_email=' + session.user?.email}
        className="btn text-start w-full"
      ></a>
    );
  }

  return (
    <button className="btn" onClick={signIn}>
      Login
    </button>
  );
};

export default ButtonCustomerPortal;
