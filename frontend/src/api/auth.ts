import { SignInFormData, SignUpFormData } from "../types/User";

export const API_URL = "http://localhost:8000";

export const signUpApi = async (data: SignUpFormData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (response.status !== 200) {
    console.log(res);
    throw new Error(res.detail);
  }

  return res;
};

export const signInApi = async (data: SignInFormData) => {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);
  console.log("SignInAPI");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    console.log("in Tryt");
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers,
      credentials: "include",
      body: params,
    });
    console.log(response);

    const resData = await response.json();
    console.log(resData);

    if (response.status !== 200) {
      console.error(response);
      throw new Error(resData.detail);
    }

    return resData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
