import { useEffect, useState } from 'react';

type approval = string | null;
type account = string | null;

const useToken = () => {
  const [approval, setApproval] = useState<approval>('');
  const [token, setToken] = useState<account>('');

  useEffect(() => {
    setApproval(localStorage.getItem('approvalType'));
    setToken(localStorage.getItem('accessToken'));
  }, []);

  console.log(token);

  const Tokens = [approval + ' ' + token];
  const allToken = Tokens.join();

  return { token };
  return { allToken };
};

export default useToken;