import useUser from "@/hooks/useUser";
import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface LoginForm {
  password: string;
  passwordconfirm: string;
}

export default function User_infoForm() {
  const router = useRouter();
  const userInfo = useUser();

  const nickname = userInfo.user?.nickname;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");

  const [isWithdraw, setIsWithdraw] = useState<boolean>(false);

  const [form, setForm] = useState<LoginForm>({
    password: "",
    passwordconfirm: "",
  });

  // const [passwordMatch, setPasswordMatch] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    // checkPasswordMatch();
  };
  // const checkPasswordMatch = () => {

  //   console.log(
  //     form.password === form.passwordconfirm,
  //     form.password,
  //     form.passwordconfirm
  //   );
  // };

  const handleChangePassword = async () => {
    const TOKEN = localStorage.getItem("accessToken");
    console.log(
      "handlepassword",
      nickname,
      form.password,
      form.passwordconfirm
    );
    await axios
      .patch(
        `/api/member`,
        {
          nickname: nickname,
          password: form.password,
          checkedPassword: form.passwordconfirm,
        },
        {
          headers: {
            withCredentials: true,
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      .then((res) => res.status === 200 && alert("password changed"))
      .then(() => setIsEdit((prev) => !prev));
  };

  const handleWithdraw = async (password: string) => {
    // 회원탈퇴
    const TOKEN = localStorage.getItem("accessToken");
    let isAgree = confirm("Would you like to leave?");
    {
      isAgree &&
        (await axios.delete(`/api/member/withdraw`, {
          data: {
            withdrawPassword: password,
          },
          headers: {
            withCredentials: true,
            Authorization: `Bearer ${TOKEN}`,
          },
        }));
    }

    router.push("/login");
  };

  return (
    <UserInfoContainer>
      {!userInfo.user?.firebaseAuth && (
        <button onClick={() => setIsEdit((prev) => !prev)}>
          {!isEdit ? "Change Password" : "Cancel"}
        </button>
      )}
      {isEdit ? (
        <>
          {!isWithdraw ? (
            <>
              <StyledDiv>
                <span>Password</span>
                <StyledInput
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </StyledDiv>
              <StyledDiv>
                <span>confirmPassword</span>
                <StyledInput
                  type="password"
                  name="passwordconfirm"
                  value={form.passwordconfirm}
                  onChange={handleChange}
                />
              </StyledDiv>
              <ChangeBtn
                onClick={handleChangePassword}
                type="submit"
                disabled={form.password !== form.passwordconfirm}
              >
                Change Password
              </ChangeBtn>

              <button onClick={() => setIsWithdraw((prev) => !prev)}>
                Withdraw
              </button>
            </>
          ) : (
            <>
              <span>confirm password</span>
              <StyledInput
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              ></StyledInput>
              <button onClick={() => handleWithdraw(password as string)}>
                Withdrawal
              </button>
              <button onClick={() => setIsWithdraw((prev) => !prev)}>
                Withdrawal cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <UserInfoWrapper>E-mail: {userInfo.user?.email}</UserInfoWrapper>
          <UserInfoWrapper>Nickname: {userInfo.user?.nickname}</UserInfoWrapper>
        </>
      )}
    </UserInfoContainer>
  );
}

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  justify-content: center;

  width: 80%;
  margin: 5px;
  padding: 20px;

  border-radius: 10px;

  box-shadow: 0 2px 5px var(--color-main);
`;

const StyledDiv = styled.div`
  padding-top: 2rem;
`;

const StyledInput = styled.input`
  width: 15vw;

  float: right;
  margin-left: 1rem;

  border: none;
  border-bottom: 1px solid var(--color-normal);

  outline: none;

  &:focus {
    border-bottom: 2px solid var(--color-normal);
  }
`;

const ChangeBtn = styled.button`
  background-color: var(--color-light);
  border: 3px solid var(--color-deep);
`;
