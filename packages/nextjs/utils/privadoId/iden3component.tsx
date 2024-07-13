import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const useIden3Auth = () => {
  const [iden3Auth, setIden3Auth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIden3Auth = async () => {
      try {
        const { auth } = await import('@iden3/js-iden3-auth');
        setIden3Auth(auth);
      } catch (err) {
        setError('Failed to load @iden3/js-iden3-auth');
        console.error(err);
      }
    };

    loadIden3Auth();
  }, []);

  return { iden3Auth, error };
};

const Iden3AuthComponent: React.FC = () => {
  const { iden3Auth, error } = useIden3Auth();

  if (error) {
    return <div>{error}</div>;
  }

  if (!iden3Auth) {
    return <div>Loading...</div>;
  }
};

export default Iden3AuthComponent;
